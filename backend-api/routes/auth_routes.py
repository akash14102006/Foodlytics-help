from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from models import UserCreate, UserLogin, TokenResponse, UserResponse, UserProfile
from auth import hash_password, verify_password, create_access_token, get_current_user
from database import get_db
from fastapi import Depends

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def user_to_response(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "profile": user.get("profile"),
        "created_at": user.get("created_at", datetime.utcnow()),
    }

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate):
    db = get_db()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "profile": {
            "age": None, "weight": None, "height": None,
            "health_conditions": [], "fitness_goal": "maintain",
            "daily_calorie_goal": 2000
        },
        "created_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    token = create_access_token({"sub": str(result.inserted_id)})
    return {"access_token": token, "token_type": "bearer", "user": user_to_response(user_doc)}

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer", "user": user_to_response(user)}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return user_to_response(current_user)
