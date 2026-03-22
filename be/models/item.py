from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class ItemStatus(str, Enum):
    waiting = "waiting"
    available = "available"
    claimed = "claimed"
    delivered = "delivered"
    rejected = "rejected"
    expired = "expired"
    redirected = "redirected"
    completed = "completed"


class ItemSize(str, Enum):
    small = "small"
    big = "big"


class DeliveryMethod(str, Enum):
    delivery = "delivery"
    pickup = "pickup"


class PickupPoint(str, Enum):
    canteen = "canteen"
    lobby = "lobby"
    library = "library"
    parking = "parking"


# ---------------------------------------------------------------------------
# Nested Models
# ---------------------------------------------------------------------------

class ClaimInfo(BaseModel):
    name: str
    email: EmailStr
    phone: str
    method: DeliveryMethod
    pickup_point: Optional[PickupPoint] = None
    address: Optional[str] = None
    claimed_at: datetime = Field(default_factory=datetime.utcnow)
    picked_up_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


# ---------------------------------------------------------------------------
# Database Document
# ---------------------------------------------------------------------------

class ItemInDB(BaseModel):
    """Represents a donation item as stored in MongoDB."""
    id: Optional[str] = Field(None, alias="_id")
    name: str = ""
    image: str = ""
    front_image: Optional[str] = None
    back_image: Optional[str] = None
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    status: ItemStatus = ItemStatus.waiting
    condition: str = ""
    ocr_confidence: float = 0.0
    category: str = ""
    size: ItemSize = ItemSize.small
    donor_name: Optional[str] = None
    donor_email: Optional[str] = None
    agreed_to_redistribution: bool = False
    claimed_by: Optional[ClaimInfo] = None
    assigned_institution: Optional[str] = None
    reward_points: int = 0

    class Config:
        populate_by_name = True


# ---------------------------------------------------------------------------
# API Response (camelCase aliases for the Next.js frontend)
# ---------------------------------------------------------------------------

class ItemResponse(BaseModel):
    id: str
    name: str
    image: str
    front_image: Optional[str] = Field(None, alias="frontImage")
    back_image: Optional[str] = Field(None, alias="backImage")
    detected_at: datetime = Field(alias="detectedAt")
    status: ItemStatus
    condition: str
    category: str
    size: ItemSize
    donor_name: Optional[str] = Field(None, alias="donorName")
    donor_email: Optional[str] = Field(None, alias="donorEmail")
    claimed_by: Optional[dict] = Field(None, alias="claimedBy")

    class Config:
        populate_by_name = True
        from_attributes = True

    @classmethod
    def from_db(cls, doc: dict) -> "ItemResponse":
        """Convert a MongoDB document to an API response."""
        # MongoDB uses _id, frontend expects id
        doc["id"] = str(doc.pop("_id", doc.get("id", "")))

        # Convert claimed_by dates if present
        claimed = doc.get("claimed_by")
        if claimed:
            doc["claimedBy"] = {
                "name": claimed.get("name", ""),
                "email": claimed.get("email", ""),
                "method": claimed.get("method", ""),
                "pickupPoint": claimed.get("pickup_point"),
                "claimedAt": claimed.get("claimed_at"),
                "pickedUpAt": claimed.get("picked_up_at"),
            }
        else:
            doc["claimedBy"] = None

        return cls(
            id=doc["id"],
            name=doc.get("name", ""),
            image=doc.get("image", ""),
            frontImage=doc.get("front_image"),
            backImage=doc.get("back_image"),
            detectedAt=doc.get("detected_at", datetime.now(datetime.timezone.utc)),
            status=doc.get("status", "waiting"),
            condition=doc.get("condition", ""),
            category=doc.get("category", ""),
            size=doc.get("size", "small"),
            donorName=doc.get("donor_name"),
            donorEmail=doc.get("donor_email"),
            claimedBy=doc.get("claimedBy"),
        )


# ---------------------------------------------------------------------------
# Request Models
# ---------------------------------------------------------------------------

class DonateRequest(BaseModel):
    """Form metadata for a donation (files sent separately as multipart)."""
    size: ItemSize
    donor_name: str
    donor_email: EmailStr
    agreed_to_redistribution: bool = False
    # Small‑item text fields (optional)
    description: Optional[str] = None
    category: Optional[str] = None


class ClaimRequest(BaseModel):
    """Body for claiming an item."""
    name: str
    email: EmailStr
    phone: str
    method: DeliveryMethod
    pickup_point: Optional[PickupPoint] = None
    address: Optional[str] = None


class AdminStatusUpdate(BaseModel):
    """Body for admin status override."""
    status: ItemStatus
    institution_name: Optional[str] = None
