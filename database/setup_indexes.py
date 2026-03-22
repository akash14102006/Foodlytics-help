"""
MongoDB Schema Documentation & Index Setup for NutriVision AI

Run this script once to create all indexes:
  python database/setup_indexes.py
"""

# ────────── Collection: users ──────────────────────────────
USERS_SCHEMA = {
    "_id": "ObjectId",
    "name": "string",
    "email": "string (unique)",
    "password": "string (bcrypt hash)",
    "profile": {
        "age": "int | null",
        "weight": "float | null (kg)",
        "height": "float | null (cm)",
        "health_conditions": "list[string]",  # diabetes, hypertension, etc.
        "fitness_goal": "string",  # weight_loss | muscle_gain | maintain | general_health
        "daily_calorie_goal": "int",
    },
    "created_at": "datetime",
}

# ────────── Collection: food_logs ─────────────────────────
FOOD_LOGS_SCHEMA = {
    "_id": "ObjectId",
    "user_id": "string (ref→users._id)",
    "date": "string (YYYY-MM-DD)",
    "food_name": "string",
    "calories": "float",
    "nutrition": {
        "protein": "float",
        "carbohydrates": "float",
        "fat": "float",
        "sugar": "float",
        "sodium": "float",
        "fiber": "float",
    },
    "health_score": "float",
    "category": "string",  # healthy | moderate | junk
    "logged_at": "datetime",
}

# ────────── Setup Script ───────────────────────────────────
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017/nutrivision"

async def create_indexes():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.nutrivision

    # Users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("name")
    print("[OK] users indexes created")

    # Food logs
    await db.food_logs.create_index([("user_id", 1), ("date", -1)])
    await db.food_logs.create_index([("user_id", 1), ("logged_at", -1)])
    await db.food_logs.create_index("category")
    print("[OK] food_logs indexes created")

    client.close()
    print("[DONE] All indexes created successfully!")

if __name__ == "__main__":
    asyncio.run(create_indexes())
