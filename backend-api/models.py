from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class HealthGoal(str, Enum):
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    maintain = "maintain"
    general_health = "general_health"

class HealthCondition(str, Enum):
    diabetes = "diabetes"
    hypertension = "hypertension"
    heart_disease = "heart_disease"
    none = "none"

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    health_conditions: Optional[List[str]] = []
    fitness_goal: Optional[str] = "maintain"
    daily_calorie_goal: Optional[int] = 2000

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    profile: Optional[UserProfile] = None
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class NutritionInfo(BaseModel):
    calories: float = 0
    protein: float = 0
    carbohydrates: float = 0
    fat: float = 0
    sugar: float = 0
    sodium: float = 0
    fiber: float = 0
    serving_size: str = "100g"

class HealthRisk(BaseModel):
    condition: str
    severity: str  # low, medium, high
    description: str

class FoodAnalysisResult(BaseModel):
    food_name: str
    confidence: float
    category: str  # healthy, moderate, junk
    health_score: float  # 1-10
    nutrition: NutritionInfo
    health_risks: List[HealthRisk] = []
    ingredients: List[str] = []
    alternatives: List[str] = []
    analysis_time: float
    image_url: Optional[str] = None

class FoodLogEntry(BaseModel):
    food_name: str
    calories: float
    nutrition: Optional[NutritionInfo] = None
    health_score: Optional[float] = None
    category: Optional[str] = None
    logged_at: Optional[datetime] = None

class DailyLog(BaseModel):
    date: str
    entries: List[FoodLogEntry] = []
    total_calories: float = 0
    average_health_score: float = 0
