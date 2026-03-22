from bson import ObjectId
from fastapi import APIRouter, HTTPException

from database import get_items_collection
from models.item import AdminStatusUpdate, ItemResponse

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/items", response_model=list[ItemResponse])
async def admin_list_items():
    """List ALL items (no filter) for the admin dashboard."""
    collection = get_items_collection()
    cursor = collection.find({}).sort("detected_at", -1)
    docs = await cursor.to_list(length=200)
    return [ItemResponse.from_db(doc) for doc in docs]


@router.patch("/items/{item_id}/status", response_model=ItemResponse)
async def admin_update_status(item_id: str, body: AdminStatusUpdate):
    """
    Admin override: change an item's status.

    Used for approve/reject/assign actions in the admin dashboard.
    """
    collection = get_items_collection()

    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    item = await collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_fields = {"status": body.status.value}
    if body.institution_name:
        update_fields["assigned_institution"] = body.institution_name

    await collection.update_one({"_id": oid}, {"$set": update_fields})

    updated = await collection.find_one({"_id": oid})
    return ItemResponse.from_db(updated)


@router.post("/items/{item_id}/assign", response_model=ItemResponse)
async def admin_assign_item(item_id: str, institution_name: str):
    """
    Assign an expired item to a local institution (orphanage/nursing home).

    Updates status to REDIRECTED and stores the institution name.
    """
    collection = get_items_collection()

    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    item = await collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.get("status") not in ("expired", "available", "expiring"):
        raise HTTPException(
            status_code=409,
            detail="Only expired/available items can be assigned to institutions",
        )

    await collection.update_one(
        {"_id": oid},
        {
            "$set": {
                "status": "redirected",
                "assigned_institution": institution_name,
            }
        },
    )

    # TODO: Send email notification to donor
    # donor_email = item.get("donor_email")
    # if donor_email:
    #     send_notification_email(donor_email, institution_name)

    updated = await collection.find_one({"_id": oid})
    return ItemResponse.from_db(updated)


@router.patch("/items/{item_id}/complete", response_model=ItemResponse)
async def admin_complete_item(item_id: str):
    """Mark a redirected item as COMPLETED after batch dispatch."""
    collection = get_items_collection()

    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    item = await collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.get("status") != "redirected":
        raise HTTPException(
            status_code=409,
            detail="Only redirected items can be marked as completed",
        )

    await collection.update_one(
        {"_id": oid},
        {"$set": {"status": "completed"}},
    )

    updated = await collection.find_one({"_id": oid})
    return ItemResponse.from_db(updated)
