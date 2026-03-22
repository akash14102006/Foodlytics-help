from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, date
from bson import ObjectId
from auth import get_current_user
from database import get_db
from models import FoodLogEntry

router = APIRouter(prefix="/api/tracker", tags=["Food Tracker"])

@router.post("/log")
async def log_food(entry: FoodLogEntry, current_user: dict = Depends(get_current_user)):
    """Log a food item to the daily tracker."""
    db = get_db()
    today = date.today().isoformat()
    user_id = str(current_user["_id"])
    
    log_entry = {
        "user_id": user_id,
        "date": today,
        "food_name": entry.food_name,
        "calories": entry.calories,
        "nutrition": entry.nutrition.model_dump() if entry.nutrition else None,
        "health_score": entry.health_score,
        "category": entry.category,
        "logged_at": datetime.utcnow(),
    }
    
    result = await db.food_logs.insert_one(log_entry)
    return {"success": True, "log_id": str(result.inserted_id)}

@router.get("/today")
async def get_today_log(current_user: dict = Depends(get_current_user)):
    """Get today's food log."""
    db = get_db()
    today = date.today().isoformat()
    user_id = str(current_user["_id"])
    
    logs = await db.food_logs.find({"user_id": user_id, "date": today}).to_list(100)
    
    total_calories = sum(log.get("calories", 0) for log in logs)
    avg_health_score = (
        sum(log.get("health_score", 0) for log in logs if log.get("health_score")) /
        max(1, sum(1 for log in logs if log.get("health_score")))
    )
    
    daily_goal = current_user.get("profile", {}).get("daily_calorie_goal", 2000) if current_user.get("profile") else 2000
    
    entries = []
    for log in logs:
        entries.append({
            "id": str(log["_id"]),
            "food_name": log["food_name"],
            "calories": log["calories"],
            "nutrition": log.get("nutrition"),
            "health_score": log.get("health_score"),
            "category": log.get("category"),
            "logged_at": log.get("logged_at"),
        })
    
    return {
        "date": today,
        "entries": entries,
        "total_calories": round(total_calories, 1),
        "remaining_calories": round(daily_goal - total_calories, 1),
        "daily_goal": daily_goal,
        "average_health_score": round(avg_health_score, 1),
        "meal_count": len(logs),
    }

@router.get("/history")
async def get_history(days: int = 7, current_user: dict = Depends(get_current_user)):
    """Get food log history for the past N days."""
    from datetime import timedelta
    db = get_db()
    user_id = str(current_user["_id"])
    
    history = []
    for i in range(days):
        day = (date.today() - timedelta(days=i)).isoformat()
        logs = await db.food_logs.find({"user_id": user_id, "date": day}).to_list(100)
        
        if logs:
            total_cal = sum(log.get("calories", 0) for log in logs)
            scores = [log.get("health_score", 0) for log in logs if log.get("health_score")]
            avg_score = sum(scores) / len(scores) if scores else 0
            history.append({
                "date": day,
                "total_calories": round(total_cal, 1),
                "average_health_score": round(avg_score, 1),
                "meal_count": len(logs),
            })
        else:
            history.append({"date": day, "total_calories": 0, "average_health_score": 0, "meal_count": 0})
    
    return {"history": history}

@router.delete("/log/{log_id}")
async def delete_log(log_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a food log entry."""
    db = get_db()
    user_id = str(current_user["_id"])
    
    result = await db.food_logs.delete_one({"_id": ObjectId(log_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log entry not found")
    
    return {"success": True}

@router.get("/addiction-analysis")
async def analyze_food_addiction(current_user: dict = Depends(get_current_user)):
    """Analyze food addiction patterns over the past week."""
    from datetime import timedelta
    db = get_db()
    user_id = str(current_user["_id"])
    
    week_logs = []
    for i in range(7):
        day = (date.today() - timedelta(days=i)).isoformat()
        logs = await db.food_logs.find({"user_id": user_id, "date": day}).to_list(100)
        week_logs.extend(logs)
    
    junk_count = sum(1 for log in week_logs if log.get("category") == "junk")
    total = len(week_logs)
    
    if total == 0:
        return {"message": "No data for this week", "risk_level": "none", "junk_percentage": 0}
    
    junk_pct = (junk_count / total) * 100
    
    if junk_pct >= 60:
        risk = "high"
        suggestion = "You consumed junk food frequently this week. Increase vegetables and lean protein intake."
    elif junk_pct >= 30:
        risk = "medium"
        suggestion = "You consumed some junk food this week. Try replacing one junk meal per day with a healthy option."
    else:
        risk = "low"
        suggestion = "Great job! Your diet is mostly healthy. Keep it up!"
    
    return {
        "junk_food_count": junk_count,
        "total_meals": total,
        "junk_percentage": round(junk_pct, 1),
        "risk_level": risk,
        "message": f"You consumed junk food {junk_count} times this week.",
        "suggestion": suggestion,
    }
