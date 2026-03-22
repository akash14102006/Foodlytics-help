from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client.nutrivision
    print("[OK] Connected to MongoDB")

async def close_db():
    global client
    if client:
        client.close()
        print("[OK] MongoDB connection closed")

def get_db():
    return db
