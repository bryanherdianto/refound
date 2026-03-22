from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from database import get_items_collection
from models.item import ItemResponse, ItemStatus

router = APIRouter(prefix="/api/items", tags=["Items"])


@router.get("", response_model=list[ItemResponse])
async def list_items(status: Optional[ItemStatus] = Query(None)):
    """
    List donation items, optionally filtered by status.
    Example: GET /api/items?status=available
    """
    collection = get_items_collection()

    query = {}
    if status:
        query["status"] = status.value

    cursor = collection.find(query).sort("detected_at", -1)
    docs = await cursor.to_list(length=100)

    return [ItemResponse.from_db(doc) for doc in docs]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):
    """Get a single item by its ID."""
    collection = get_items_collection()

    from bson import ObjectId

    try:
        doc = await collection.find_one({"_id": ObjectId(item_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    if not doc:
        raise HTTPException(status_code=404, detail="Item not found")

    return ItemResponse.from_db(doc)
