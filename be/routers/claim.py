from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from database import get_items_collection
from models.item import ClaimRequest, ItemResponse

router = APIRouter(prefix="/api/claim", tags=["Claim"])


@router.post("/{item_id}", response_model=ItemResponse)
async def claim_item(item_id: str, claim: ClaimRequest):
    """
    Claim an available item.

    Updates the item status to CLAIMED and embeds the claimant info.
    """
    collection = get_items_collection()

    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    # Check item exists and is available
    item = await collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.get("status") != "available":
        raise HTTPException(
            status_code=409,
            detail=f"Item is not available (current status: {item.get('status')})",
        )

    # Build claim info document
    claim_info = {
        "name": claim.name,
        "email": claim.email,
        "phone": claim.phone,
        "method": claim.method.value,
        "pickup_point": claim.pickup_point.value if claim.pickup_point else None,
        "address": claim.address,
        "claimed_at": datetime.utcnow(),
        "picked_up_at": None,
    }

    # Update the item
    await collection.update_one(
        {"_id": oid},
        {
            "$set": {
                "status": "claimed",
                "claimed_by": claim_info,
            }
        },
    )

    # Fetch and return updated item
    updated = await collection.find_one({"_id": oid})
    return ItemResponse.from_db(updated)
