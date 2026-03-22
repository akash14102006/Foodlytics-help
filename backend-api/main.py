from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from database import connect_db, close_db
from auth import get_current_user

from routes.auth_routes import router as auth_router
from routes.food_routes import router as food_router
from routes.tracker_routes import router as tracker_router
from routes.user_routes import router as user_router
from rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    os.makedirs("uploads", exist_ok=True)
    yield
    await close_db()

app = FastAPI(
    title="NutriVision AI API",
    description="🥗 Smart Food Health Analyzer API — AI-powered nutrition analysis and health tracking",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth_router)
app.include_router(food_router)
app.include_router(tracker_router)
app.include_router(user_router)



@app.get("/")
async def root():
    return {
        "message": "🥗 NutriVision AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "NutriVision AI"}

from fastapi.responses import JSONResponse
from fastapi import Request
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    with open("error.log", "w") as f:
        f.write(traceback.format_exc())
    print("GLOBAL ERROR:", repr(exc))
    return JSONResponse(status_code=500, content={"message": "Internal Server Error", "detail": str(exc)})

