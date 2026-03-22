from fastapi import APIRouter, Query

from database import get_items_collection
from models.item import ItemResponse

router = APIRouter(prefix="/api/tracking", tags=["Tracking"])


@router.get("", response_model=list[ItemResponse])
async def track_claims(email: str = Query(..., description="Email of the claimant")):
    """
    Get all items claimed by a specific user email.

    Used by the Tracking page to show the user their claimed items.
    """
    collection = get_items_collection()

    cursor = collection.find(
        {"claimed_by.email": email}
    ).sort("claimed_by.claimed_at", -1)

    docs = await cursor.to_list(length=50)
    return [ItemResponse.from_db(doc) for doc in docs]
