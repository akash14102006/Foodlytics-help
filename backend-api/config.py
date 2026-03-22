from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    NUTRITIONIX_APP_ID: str = ""
    NUTRITIONIX_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    MONGODB_URI: str = "mongodb://localhost:27017/nutrivision"
    JWT_SECRET: str = "change_this_secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080
    USDA_API_KEY: str = "DEMO_KEY"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
