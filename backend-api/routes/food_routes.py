import os
import time
import re
import uuid
import base64
import httpx
import google.generativeai as genai
from config import settings
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, Request
from fastapi.responses import JSONResponse
from PIL import Image
import io
from auth import get_current_user
from food_classifier import classify_food, get_health_risks
from nutrition_api import fetch_nutritionix, fetch_usda
from models import FoodAnalysisResult
from typing import Optional
from rate_limiter import limiter
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/food", tags=["Food Analysis"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def detect_food_from_image(image_path: str) -> dict:
    """
    Use Google Gemini Vision Pro to identify food AND ingredients from image.
    Returns: {"name": str, "ingredients": list[str]} or None
    """
    if not settings.GEMINI_API_KEY:
        print("⚠️ GEMINI_API_KEY not set. Using legacy detection.")
        return None

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Load image
        img = Image.open(image_path)
        
        # Enhanced prompt for ingredients and name
        prompt = """
        Analyze this image and identify:
        1. The main food item (e.g., 'Mutton Curry', 'Pasta', 'Burger').
        2. A list of 5-10 primary ingredients visible or likely present in this dish.
        
        Format your response EXCLUSIVELY as a JSON object like this:
        {"food": "Food Name", "ingredients": ["ingredient1", "ingredient2", ...]}
        
        If there is no food in the image, return: {"food": "Not Food", "ingredients": []}
        """
        
        # ⚡ USE ASYNC API for better responsiveness
        response = await model.generate_content_async([prompt, img])
        detected_text = response.text.strip().lower()

        # Extract JSON from response
        json_match = re.search(r"({.*})", detected_text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(1))
            food_name = data.get("food", "").strip()
            ingredients = data.get("ingredients", [])
            
            if "not food" in food_name.lower():
                print(f"🚫 Gemini determined image is not food: {food_name}")
                return None
                
            print(f"💎 Gemini Pro Detection: {food_name} with {len(ingredients)} ingredients")
            return {"name": food_name, "ingredients": ingredients}
            
    except Exception as e:
        print(f"⚠️ Gemini detection failed: {e}")
    
    return None

@router.post("/analyze", response_model=FoodAnalysisResult)
@limiter.limit("20/minute")
async def analyze_food_image(
    request: Request,
    file: UploadFile = File(None),
    food_name: str = Form(None),
    current_user: dict = Depends(get_current_user),
):
    """Analyze a food item by image or name."""
    
    if not file and not food_name:
        raise HTTPException(status_code=400, detail="Provide either a food image or food name")
    
    # If image provided, save it and run AI detection
    image_url = None
    detected_name = food_name
    ingredients = []
    
    if file:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File too large. Max 10MB.")
        
        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(contents)
        
        image_url = f"/uploads/{filename}"
        
        # 🚀 AI-POWERED FOOD DETECTION
        if not food_name:
            ai_data = await detect_food_from_image(filepath)
            if ai_data:
                detected_name = ai_data["name"]
                ingredients = ai_data["ingredients"]
                print(f"✅ AI detected food: {detected_name}")
            else:
                # If AI can't detect, we need user to provide name
                raise HTTPException(
                    status_code=400, 
                    detail="Could not identify food from image. Please provide the food name manually."
                )
        
    if not detected_name:
        raise HTTPException(status_code=400, detail="Food name is required")
    
    # Classify the food
    result = classify_food(detected_name)
    
    # Try to enrich with real API data
    api_nutrition = await fetch_nutritionix(detected_name)
    if not api_nutrition:
        api_nutrition = await fetch_usda(detected_name)
    
    if api_nutrition:
        result["nutrition"] = api_nutrition
        result["health_risks"] = get_health_risks(api_nutrition)
    
    result["image_url"] = image_url
    result["ingredients"] = ingredients
    return result

@router.post("/analyze-name")
@limiter.limit("30/minute")
async def analyze_by_name(
    request: Request,
    food_name: str,
    current_user: dict = Depends(get_current_user),
):
    """Quick analysis by food name (no image needed)."""
    result = classify_food(food_name)
    api_nutrition = await fetch_nutritionix(food_name)
    if api_nutrition:
        result["nutrition"] = api_nutrition
        result["health_risks"] = get_health_risks(api_nutrition)
    return result

@router.get("/search")
async def search_food(q: str, current_user: dict = Depends(get_current_user)):
    """Search food database."""
    from food_classifier import FOOD_DATABASE
    query = q.lower()
    matches = [k for k in FOOD_DATABASE if query in k]
    return {"results": matches[:10], "query": q}

@router.get("/categories")
async def get_food_categories():
    """Get all food categories available."""
    from food_classifier import FOOD_DATABASE
    categories = {}
    for name, data in FOOD_DATABASE.items():
        cat = data["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(name)
    return categories
