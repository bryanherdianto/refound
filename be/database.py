from motor.motor_asyncio import AsyncIOMotorClient
from config import get_settings

_client: AsyncIOMotorClient | None = None


async def connect_db():
    """Initialize the MongoDB connection."""
    global _client
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    # Verify connection
    await _client.admin.command("ping")
    print("Connected to MongoDB")


async def close_db():
    """Close the MongoDB connection."""
    global _client
    if _client:
        _client.close()
        print("MongoDB connection closed")


def get_db():
    """Get the ReFound database instance."""
    if _client is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return _client["refound"]


def get_items_collection():
    """Shortcut to get the items collection."""
    return get_db()["items"]
