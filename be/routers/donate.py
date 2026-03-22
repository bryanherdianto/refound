from datetime import datetime

from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from typing import Optional

from database import get_items_collection
from models.item import ItemSize, ItemResponse
from services.s3 import upload_image
from services.gemini import analyze_photo

router = APIRouter(prefix="/api/donate", tags=["Donate"])


@router.post("", response_model=ItemResponse)
async def donate_item(
    size: ItemSize = Form(...),
    donor_name: str = Form(...),
    donor_email: str = Form(...),
    agreed_to_redistribution: bool = Form(False),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    photo_front: Optional[UploadFile] = File(None),
    photo_back: Optional[UploadFile] = File(None),
):
    """
    Create a new donation item.

    - **Small items**: text description + category only.
    - **Big items**: requires photo_front and photo_back uploads.

    Photos are uploaded to S3 and analyzed by Gemini for auto-categorization.
    """
    collection = get_items_collection()

    # Base item document
    item_doc = {
        "size": size.value,
        "donor_name": donor_name,
        "donor_email": donor_email,
        "agreed_to_redistribution": agreed_to_redistribution,
        "detected_at": datetime.utcnow(),
        "status": "available",
        "reward_points": 10,
        "name": "",
        "image": "",
        "front_image": None,
        "back_image": None,
        "condition": "",
        "ocr_confidence": 0.0,
        "category": category or "",
        "claimed_by": None,
        "assigned_institution": None,
    }

    if size == ItemSize.big:
        # Big items require photos
        if not photo_front or not photo_back:
            raise HTTPException(
                status_code=400,
                detail="Big items require both photo_front and photo_back",
            )

        # Upload photos to S3
        front_url = await upload_image(file=photo_front, prefix="donations/front")
        back_url = await upload_image(file=photo_back, prefix="donations/back")

        item_doc["front_image"] = front_url
        item_doc["back_image"] = back_url
        item_doc["image"] = front_url  # Use front image as main display

        # Analyze front photo with Gemini for auto-categorization
        front_bytes = await photo_front.seek(0) or b""
        # Re-read since upload consumed the stream
        await photo_front.seek(0)
        front_bytes = await photo_front.read()

        analysis = await analyze_photo(front_bytes)
        item_doc["name"] = analysis.get("name", "Donated Item")
        item_doc["category"] = analysis.get("category", category or "Other")
        item_doc["condition"] = analysis.get("condition", "Unverified")
        item_doc["ocr_confidence"] = analysis.get("confidence", 0.5)

    else:
        # Small items use text description
        item_doc["name"] = description or "Small Donation"
        item_doc["category"] = category or "Other"
        item_doc["condition"] = "Eligible for reuse"
        item_doc["ocr_confidence"] = 1.0  # User-provided, no AI needed

    # Insert into MongoDB
    result = await collection.insert_one(item_doc)
    item_doc["_id"] = result.inserted_id

    return ItemResponse.from_db(item_doc)
