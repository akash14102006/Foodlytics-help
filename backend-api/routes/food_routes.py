import os
import time
import uuid
import base64
import httpx
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

router = APIRouter(prefix="/api/food", tags=["Food Analysis"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def detect_food_from_image(image_path: str) -> str:
    """
    Use AI image recognition to detect food from image.
    Uses Hugging Face's free food classification model.
    """
    try:
        # Read and encode image
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        
        # Use Hugging Face Inference API (free tier)
        # Model: nateraw/food or google/vit-base-patch16-224
        API_URL = "https://api-inference.huggingface.co/models/nateraw/food"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                API_URL,
                headers={"Content-Type": "application/octet-stream"},
                content=image_bytes
            )
            
            if response.status_code == 200:
                results = response.json()
                if results and len(results) > 0:
                    # Get top prediction
                    top_prediction = results[0]
                    food_label = top_prediction.get("label", "").lower()
                    confidence = top_prediction.get("score", 0)
                    
                    # Clean up the label (remove numbers, underscores)
                    food_label = food_label.replace("_", " ").strip()
                    
                    print(f"🔍 AI Detection: {food_label} (confidence: {confidence:.2%})")
                    
                    if confidence > 0.3:  # Only use if reasonably confident
                        return food_label
            
            # Fallback: try another model
            API_URL_2 = "https://api-inference.huggingface.co/models/Kaludi/food-category-classification-v2.0"
            response2 = await client.post(
                API_URL_2,
                headers={"Content-Type": "application/octet-stream"},
                content=image_bytes
            )
            
            if response2.status_code == 200:
                results2 = response2.json()
                if results2 and len(results2) > 0:
                    top_prediction = results2[0]
                    food_label = top_prediction.get("label", "").lower()
                    confidence = top_prediction.get("score", 0)
                    food_label = food_label.replace("_", " ").strip()
                    
                    print(f"🔍 AI Detection (Model 2): {food_label} (confidence: {confidence:.2%})")
                    
                    if confidence > 0.3:
                        return food_label
                    
    except Exception as e:
        print(f"⚠️ AI detection failed: {e}")
    
    # If AI fails, return None so we can ask user
    return None

@router.post("/analyze", response_model=FoodAnalysisResult)
@limiter.limit("5/minute")
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
            ai_detected = await detect_food_from_image(filepath)
            if ai_detected:
                detected_name = ai_detected
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
    return result

@router.post("/analyze-name")
@limiter.limit("10/minute")
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
