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
import json
import logging
from auth import get_current_user
from food_classifier import classify_food, get_health_risks
from nutrition_api import fetch_nutritionix, fetch_usda
from models import FoodAnalysisResult
from typing import Optional
from rate_limiter import limiter

logger = logging.getLogger(__name__)

# Configure Gemini once globally
if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("Gemini API configured successfully")
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}")

router = APIRouter(prefix="/api/food", tags=["Food Analysis"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def detect_food_from_image(image_bytes: bytes) -> dict:
    """Extract food name and ingredients using a smart fallback model picker."""
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set. Vision detection disabled.")
        return {"name": "unknown", "ingredients": []}

    # 🚀 SMART MODEL PICKER
    # We try different naming conventions to bypass SDK v1beta lookup errors
    models_to_try = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "models/gemini-1.5-flash", 
        "models/gemini-1.5-pro",
        "models/gemini-pro-vision"
    ]
    
    last_error = None
    
    for model_name in models_to_try:
        try:
            logger.info(f"Attempting detection with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            # Prepare image blob
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
            
            prompt = """
            Identify the primary food item in this image.
            Return a JSON object with:
            1. "food": Concise food name (e.g. "Strawberry Bowl", "Cheeseburger").
            2. "ingredients": List of 5-10 visible or likely ingredients.
            
            If it's not food, return {"food": "unknown", "ingredients": []}.
            """
            
            # Use JSON mode if the model is modern, else use text parsing
            gen_config = {"response_mime_type": "application/json"} if "1.5" in model_name else None
            
            response = await model.generate_content_async(
                [prompt, image_part],
                generation_config=gen_config
            )
            
            if response.text:
                # Robust parsing for both JSON mode and text mode models
                json_str = response.text.strip()
                # If legacy model wraps in ```json ... ```
                if "```" in json_str:
                    json_str = re.search(r"({.*})", json_str, re.DOTALL).group(1)
                
                data = json.loads(json_str)
                food_name = data.get("food") or data.get("name") or "unknown"
                ingredients = data.get("ingredients", [])
                
                logger.info(f"✅ Success with {model_name}: {food_name}")
                return {"name": food_name, "ingredients": ingredients}
                
        except Exception as e:
            last_error = str(e)
            logger.warning(f"Model {model_name} failed: {e}")
            continue # Try next model
            
    logger.error(f"All Gemini models failed. Last error: {last_error}")
    return {"name": "unknown", "ingredients": []}

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
        raise HTTPException(status_code=400, detail="Provide a food image or name")
    
    detected_name = food_name
    ingredients = []
    image_url = None
    
    if file:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (Max 10MB)")
        
        # Save for UI display
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(contents)
        image_url = f"/uploads/{filename}"
        
        # Run AI detection if name not provided manually
        if not detected_name:
            ai_data = await detect_food_from_image(contents)
            detected_name = ai_data["name"]
            ingredients = ai_data["ingredients"]
            
            if detected_name == "unknown":
                # Clean up if failed
                if os.path.exists(filepath): os.remove(filepath)
                raise HTTPException(
                    status_code=400, 
                    detail="AI could not identify the food. Please enter the food name below the image."
                )

    if not detected_name or detected_name == "unknown":
         raise HTTPException(status_code=400, detail="Food name is required")
    
    # Process findings
    result_data = classify_food(detected_name)
    
    # Enrich with real-world nutrition APIs
    api_nutrition = await fetch_nutritionix(detected_name)
    if not api_nutrition:
        api_nutrition = await fetch_usda(detected_name)
    
    if api_nutrition:
        result_data["nutrition"] = api_nutrition
        result_data["health_risks"] = get_health_risks(api_nutrition)
    
    result_data["image_url"] = image_url
    result_data["ingredients"] = ingredients
    
    return result_data

@router.post("/analyze-name")
@limiter.limit("30/minute")
async def analyze_by_name(
    request: Request,
    food_name: str,
    current_user: dict = Depends(get_current_user),
):
    """Analysis by food name only."""
    result = classify_food(food_name)
    api_nutrition = await fetch_nutritionix(food_name)
    if api_nutrition:
        result["nutrition"] = api_nutrition
        result["health_risks"] = get_health_risks(api_nutrition)
    return result

@router.get("/search")
async def search_food(q: str, current_user: dict = Depends(get_current_user)):
    from food_classifier import FOOD_DATABASE
    query = q.lower()
    matches = [k for k in FOOD_DATABASE if query in k]
    return {"results": matches[:10], "query": q}

@router.get("/categories")
async def get_food_categories():
    from food_classifier import FOOD_DATABASE
    categories = {}
    for name, data in FOOD_DATABASE.items():
        cat = data["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(name)
    return categories
