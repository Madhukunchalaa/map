import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

# Explicitly load from backend root
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = "opportunity_map"

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_storage(self):
        print(f"Connecting to MongoDB Atlas...")
        if not MONGODB_URL:
            print("ERROR: MONGODB_URL not set in .env!")
            return
        try:
            self.client = AsyncIOMotorClient(MONGODB_URL, tlsCAFile=certifi.where())
            self.db = self.client[DATABASE_NAME]
            # Simple ping to verify connection
            await self.client.admin.command('ping')
            print("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")

    async def close_storage(self):
        if self.client:
            self.client.close()
            print("MongoDB Atlas connection closed.")

mongo = MongoDB()

def get_db():
    """Synchronous accessor — returns the db handle (set during startup)."""
    return mongo.db
