import httpx
from typing import Optional, Dict, Any
from config import settings

NUTRITIONIX_BASE = "https://trackapi.nutritionix.com/v2"
USDA_BASE = "https://api.nal.usda.gov/fdc/v1"

async def fetch_nutritionix(food_name: str) -> Optional[Dict[str, Any]]:
    """Fetch nutrition data from Nutritionix API."""
    if not settings.NUTRITIONIX_APP_ID or settings.NUTRITIONIX_APP_ID == "your_app_id_here":
        return None
    
    headers = {
        "x-app-id": settings.NUTRITIONIX_APP_ID,
        "x-app-key": settings.NUTRITIONIX_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {"query": food_name, "timezone": "US/Eastern"}
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            resp = await client.post(f"{NUTRITIONIX_BASE}/natural/nutrients", headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                foods = data.get("foods", [])
                if foods:
                    f = foods[0]
                    return {
                        "calories": f.get("nf_calories", 0),
                        "protein": f.get("nf_protein", 0),
                        "carbohydrates": f.get("nf_total_carbohydrate", 0),
                        "fat": f.get("nf_total_fat", 0),
                        "sugar": f.get("nf_sugars", 0),
                        "sodium": f.get("nf_sodium", 0),
                        "fiber": f.get("nf_dietary_fiber", 0),
                        "serving_size": f"{f.get('serving_qty', 1)} {f.get('serving_unit', 'serving')}",
                    }
        except Exception as e:
            print(f"Nutritionix API error: {e}")
    return None

async def fetch_usda(food_name: str) -> Optional[Dict[str, Any]]:
    """Fetch nutrition data from USDA FoodData Central API."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            search_resp = await client.get(
                f"{USDA_BASE}/foods/search",
                params={"query": food_name, "api_key": settings.USDA_API_KEY, "pageSize": 1}
            )
            if search_resp.status_code == 200:
                results = search_resp.json().get("foods", [])
                if results:
                    nutrients = {n["nutrientName"]: n.get("value", 0) for n in results[0].get("foodNutrients", [])}
                    return {
                        "calories": nutrients.get("Energy", 0),
                        "protein": nutrients.get("Protein", 0),
                        "carbohydrates": nutrients.get("Carbohydrate, by difference", 0),
                        "fat": nutrients.get("Total lipid (fat)", 0),
                        "sugar": nutrients.get("Sugars, total including NLEA", 0),
                        "sodium": nutrients.get("Sodium, Na", 0),
                        "fiber": nutrients.get("Fiber, total dietary", 0),
                        "serving_size": "100g",
                    }
        except Exception as e:
            print(f"USDA API error: {e}")
    return None
