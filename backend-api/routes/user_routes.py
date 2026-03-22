from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from auth import get_current_user
from database import get_db
from models import UserProfile

router = APIRouter(prefix="/api/user", tags=["User Profile"])

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile."""
    profile = current_user.get("profile", {})
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "profile": profile,
    }

@router.put("/profile")
async def update_profile(profile: UserProfile, current_user: dict = Depends(get_current_user)):
    """Update user profile and personalize calorie goal."""
    db = get_db()
    
    # Auto-calculate BMR if all data provided
    daily_calorie_goal = profile.daily_calorie_goal or 2000
    if profile.age and profile.weight and profile.height:
        # Mifflin-St Jeor equation (assuming moderate activity)
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age
        if profile.fitness_goal == "weight_loss":
            daily_calorie_goal = int(bmr * 1.375 - 500)
        elif profile.fitness_goal == "muscle_gain":
            daily_calorie_goal = int(bmr * 1.375 + 300)
        else:
            daily_calorie_goal = int(bmr * 1.375)
    
    profile_dict = profile.model_dump()
    profile_dict["daily_calorie_goal"] = daily_calorie_goal
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile": profile_dict}}
    )
    
    return {"success": True, "profile": profile_dict, "calculated_calorie_goal": daily_calorie_goal}

@router.get("/recommendations")
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    """Get personalized food recommendations based on profile."""
    profile = current_user.get("profile", {})
    goal = profile.get("fitness_goal", "maintain") if profile else "maintain"
    conditions = profile.get("health_conditions", []) if profile else []
    
    recommendations = {
        "weight_loss": {
            "recommended": ["salad", "broccoli", "salmon", "chicken breast", "lentils", "quinoa", "spinach"],
            "avoid": ["pizza", "burger", "french fries", "soda", "donut", "cake", "chips"],
            "tips": ["Eat high-protein foods", "Choose fiber-rich vegetables", "Drink water before meals", "Avoid liquid calories"]
        },
        "muscle_gain": {
            "recommended": ["chicken breast", "salmon", "eggs", "greek yogurt", "quinoa", "lentils", "almonds"],
            "avoid": ["soda", "candy", "donut", "chips"],
            "tips": ["Eat 1.6-2.2g protein per kg body weight", "Time carbs around workouts", "Don't skip meals"]
        },
        "maintain": {
            "recommended": ["oatmeal", "banana", "apple", "brown rice", "eggs", "salad", "yogurt"],
            "avoid": ["donut", "soda", "candy"],
            "tips": ["Balance macronutrients", "Eat whole foods", "Stay hydrated", "Practice portion control"]
        },
        "general_health": {
            "recommended": ["blueberries", "spinach", "salmon", "avocado", "oatmeal", "sweet potato"],
            "avoid": ["soda", "candy", "hot dog"],
            "tips": ["Eat the rainbow (variety of vegetables)", "Include omega-3 rich foods", "Limit processed foods"]
        }
    }
    
    recs = recommendations.get(goal, recommendations["maintain"])
    
    # Add condition-specific advice
    condition_advice = []
    if "diabetes" in (conditions or []):
        condition_advice.append("Monitor carbohydrate intake carefully. Prefer low-glycemic foods.")
    if "hypertension" in (conditions or []):
        condition_advice.append("Limit sodium to 1500mg/day. Eat potassium-rich foods like bananas and spinach.")
    if "heart_disease" in (conditions or []):
        condition_advice.append("Avoid trans fats and saturated fats. Choose omega-3 rich foods like salmon.")
    
    return {
        "goal": goal,
        "recommended_foods": recs["recommended"],
        "foods_to_avoid": recs["avoid"],
        "tips": recs["tips"],
        "condition_specific_advice": condition_advice,
    }

@router.get("/dashboard-stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get dashboard statistics."""
    from datetime import date, timedelta
    db = get_db()
    user_id = str(current_user["_id"])
    today = date.today().isoformat()
    
    # Today's data
    today_logs = await db.food_logs.find({"user_id": user_id, "date": today}).to_list(100)
    today_calories = sum(log.get("calories", 0) for log in today_logs)
    today_scores = [log.get("health_score", 0) for log in today_logs if log.get("health_score")]
    
    # Weekly trend
    weekly_data = []
    for i in range(7):
        day = (date.today() - timedelta(days=i)).isoformat()
        logs = await db.food_logs.find({"user_id": user_id, "date": day}).to_list(100)
        cal = sum(log.get("calories", 0) for log in logs)
        scores = [log.get("health_score", 0) for log in logs if log.get("health_score")]
        weekly_data.append({
            "date": day,
            "calories": round(cal, 1),
            "health_score": round(sum(scores) / max(1, len(scores)), 1),
        })
    
    profile = current_user.get("profile", {}) or {}
    daily_goal = profile.get("daily_calorie_goal", 2000)
    
    return {
        "today": {
            "calories": round(today_calories, 1),
            "goal": daily_goal,
            "meals": len(today_logs),
            "health_score": round(sum(today_scores) / max(1, len(today_scores)), 1),
        },
        "weekly_trend": weekly_data,
        "streak": calculate_streak(weekly_data, daily_goal),
    }

def calculate_streak(weekly_data, goal):
    streak = 0
    for day in weekly_data:
        if day["calories"] > 0 and day["calories"] <= goal:
            streak += 1
        else:
            break
    return streak
