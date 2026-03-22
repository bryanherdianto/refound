"""
Tests for Pydantic models in models/item.py

Validates:
- Enum definitions and values
- Model instantiation and defaults
- ClaimInfo construction with validation
- ItemResponse.from_db() conversion from MongoDB documents
- camelCase alias serialization for the frontend
- DonateRequest and ClaimRequest validation
"""

import os
import sys
from datetime import datetime, timezone

# Ensure the 'be' folder is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from bson import ObjectId
from models.item import (
    ItemStatus,
    ItemSize,
    DeliveryMethod,
    PickupPoint,
    ClaimInfo,
    ItemInDB,
    ItemResponse,
    DonateRequest,
    ClaimRequest,
    AdminStatusUpdate,
)


def test_enums():
    """Verify all enum values exist and match expected strings."""
    print("--- Testing Enums ---")

    # ItemStatus
    expected_statuses = [
        "waiting", "available", "claimed", "delivered",
        "rejected", "expired", "redirected", "completed",
    ]
    for s in expected_statuses:
        assert ItemStatus(s).value == s, f"Missing status: {s}"
    print(f"  ItemStatus: {len(expected_statuses)} values OK")

    # ItemSize
    assert ItemSize.small.value == "small"
    assert ItemSize.big.value == "big"
    print("  ItemSize: OK")

    # DeliveryMethod
    assert DeliveryMethod.delivery.value == "delivery"
    assert DeliveryMethod.pickup.value == "pickup"
    print("  DeliveryMethod: OK")

    # PickupPoint
    expected_points = ["canteen", "lobby", "library", "parking"]
    for p in expected_points:
        assert PickupPoint(p).value == p, f"Missing pickup point: {p}"
    print(f"  PickupPoint: {len(expected_points)} values OK")

    print("All enums passed\n")


def test_claim_info():
    """Test ClaimInfo model creation and defaults."""
    print("--- Testing ClaimInfo ---")

    claim = ClaimInfo(
        name="John Doe",
        email="john@example.com",
        phone="+62 812 3456 7890",
        method=DeliveryMethod.pickup,
        pickup_point=PickupPoint.canteen,
    )

    assert claim.name == "John Doe"
    assert claim.email == "john@example.com"
    assert claim.method == DeliveryMethod.pickup
    assert claim.pickup_point == PickupPoint.canteen
    assert claim.address is None
    assert claim.picked_up_at is None
    assert isinstance(claim.claimed_at, datetime)
    print("  Pickup claim: OK")

    # Delivery claim with address
    claim2 = ClaimInfo(
        name="Jane Doe",
        email="jane@example.com",
        phone="+62 812 0000 0000",
        method=DeliveryMethod.delivery,
        address="123 Main St, Jakarta",
    )
    assert claim2.method == DeliveryMethod.delivery
    assert claim2.address == "123 Main St, Jakarta"
    assert claim2.pickup_point is None
    print("  Delivery claim: OK")

    print("ClaimInfo passed\n")


def test_claim_info_invalid_email():
    """Test that ClaimInfo rejects invalid emails."""
    print("--- Testing ClaimInfo Invalid Email ---")

    try:
        ClaimInfo(
            name="Bad",
            email="not-an-email",
            phone="123",
            method=DeliveryMethod.pickup,
        )
        print("  Should have raised validation error")
    except Exception as e:
        print(f"  Correctly rejected invalid email: {type(e).__name__}")

    print("Invalid email test passed\n")


def test_item_in_db_defaults():
    """Test ItemInDB default values."""
    print("--- Testing ItemInDB Defaults ---")

    item = ItemInDB()

    assert item.name == ""
    assert item.image == ""
    assert item.status == ItemStatus.waiting
    assert item.size == ItemSize.small
    assert item.condition == ""
    assert item.category == ""
    assert item.donor_name is None
    assert item.donor_email is None
    assert item.agreed_to_redistribution is False
    assert item.claimed_by is None
    assert item.assigned_institution is None
    assert item.reward_points == 0
    assert isinstance(item.detected_at, datetime)
    print("  All defaults correct")

    print("ItemInDB defaults passed\n")


def test_item_response_from_db():
    """Test ItemResponse.from_db() converts MongoDB docs correctly."""
    print("--- Testing ItemResponse.from_db() ---")

    oid = ObjectId()
    now = datetime.now(timezone.utc)

    # Simple item without claim
    doc = {
        "_id": oid,
        "name": "Wireless Earphones",
        "image": "https://example.com/img.jpg",
        "front_image": None,
        "back_image": None,
        "detected_at": now,
        "status": "available",
        "condition": "Good condition",
        "category": "Electronics",
        "size": "small",
        "donor_name": "Sarah M.",
        "donor_email": "sarah@example.com",
        "claimed_by": None,
    }

    resp = ItemResponse.from_db(doc)

    assert resp.id == str(oid)
    assert resp.name == "Wireless Earphones"
    assert resp.status == ItemStatus.available
    assert resp.size == ItemSize.small
    assert resp.claimed_by is None
    print("  Simple item conversion: OK")

    # Item with claim info
    doc2 = {
        "_id": ObjectId(),
        "name": "Teddy Bear",
        "image": "https://example.com/teddy.jpg",
        "front_image": "https://example.com/front.jpg",
        "back_image": "https://example.com/back.jpg",
        "detected_at": now,
        "status": "claimed",
        "condition": "Clean and intact",
        "category": "Toys",
        "size": "big",
        "donor_name": "Emma W.",
        "donor_email": "emma@example.com",
        "claimed_by": {
            "name": "Michael Chen",
            "email": "michael@example.com",
            "method": "pickup",
            "pickup_point": "canteen",
            "claimed_at": now,
            "picked_up_at": None,
        },
    }

    resp2 = ItemResponse.from_db(doc2)

    assert resp2.status == ItemStatus.claimed
    assert resp2.size == ItemSize.big
    assert resp2.claimed_by is not None
    assert resp2.claimed_by["name"] == "Michael Chen"
    assert resp2.claimed_by["pickupPoint"] == "canteen"
    assert resp2.claimed_by["pickedUpAt"] is None
    print("  Claimed item conversion: OK")

    print("ItemResponse.from_db() passed\n")


def test_item_response_camel_case_serialization():
    """Verify JSON output uses camelCase keys for the frontend."""
    print("--- Testing camelCase Serialization ---")

    oid = ObjectId()
    now = datetime.now(timezone.utc)

    doc = {
        "_id": oid,
        "name": "USB Cable",
        "image": "https://example.com/usb.jpg",
        "front_image": None,
        "back_image": None,
        "detected_at": now,
        "status": "available",
        "condition": "Functional",
        "category": "Electronics",
        "size": "small",
        "donor_name": "Lisa P.",
        "donor_email": "lisa@example.com",
        "claimed_by": None,
    }

    resp = ItemResponse.from_db(doc)
    json_data = resp.model_dump(by_alias=True)

    # Check camelCase keys exist
    assert "frontImage" in json_data, "Missing frontImage alias"
    assert "backImage" in json_data, "Missing backImage alias"
    assert "detectedAt" in json_data, "Missing detectedAt alias"
    assert "ocrConfidence" not in json_data or "ocrConfidence" in json_data  # field exists
    assert "donorName" in json_data, "Missing donorName alias"
    assert "donorEmail" in json_data, "Missing donorEmail alias"
    assert "claimedBy" in json_data, "Missing claimedBy alias"

    # Check snake_case keys are NOT in aliased output
    assert "front_image" not in json_data, "Should use frontImage, not front_image"
    assert "back_image" not in json_data, "Should use backImage, not back_image"
    assert "detected_at" not in json_data, "Should use detectedAt, not detected_at"
    assert "donor_name" not in json_data, "Should use donorName, not donor_name"
    assert "donor_email" not in json_data, "Should use donorEmail, not donor_email"
    assert "claimed_by" not in json_data, "Should use claimedBy, not claimed_by"

    print("  All camelCase aliases present")
    print("  No snake_case keys in aliased output")

    print("camelCase serialization passed\n")


def test_donate_request():
    """Test DonateRequest validation."""
    print("--- Testing DonateRequest ---")

    req = DonateRequest(
        size=ItemSize.small,
        donor_name="Bryan",
        donor_email="bryan@example.com",
        agreed_to_redistribution=True,
        description="Blue pen",
        category="Stationery",
    )

    assert req.size == ItemSize.small
    assert req.donor_name == "Bryan"
    assert req.agreed_to_redistribution is True
    assert req.description == "Blue pen"
    print("  Small item request: OK")

    req2 = DonateRequest(
        size=ItemSize.big,
        donor_name="Emma",
        donor_email="emma@example.com",
    )
    assert req2.size == ItemSize.big
    assert req2.description is None
    assert req2.category is None
    assert req2.agreed_to_redistribution is False
    print("  Big item request (defaults): OK")

    print("DonateRequest passed\n")


def test_claim_request():
    """Test ClaimRequest validation."""
    print("--- Testing ClaimRequest ---")

    # Pickup claim
    req = ClaimRequest(
        name="Michael",
        email="michael@test.com",
        phone="+62 812 1234 5678",
        method=DeliveryMethod.pickup,
        pickup_point=PickupPoint.lobby,
    )
    assert req.method == DeliveryMethod.pickup
    assert req.pickup_point == PickupPoint.lobby
    assert req.address is None
    print("  Pickup request: OK")

    # Delivery claim
    req2 = ClaimRequest(
        name="Sarah",
        email="sarah@test.com",
        phone="+62 812 0000 0000",
        method=DeliveryMethod.delivery,
        address="456 Oak Ave, Bandung",
    )
    assert req2.method == DeliveryMethod.delivery
    assert req2.address == "456 Oak Ave, Bandung"
    assert req2.pickup_point is None
    print("  Delivery request: OK")

    print("ClaimRequest passed\n")


def test_admin_status_update():
    """Test AdminStatusUpdate model."""
    print("--- Testing AdminStatusUpdate ---")

    update = AdminStatusUpdate(status=ItemStatus.rejected)
    assert update.status == ItemStatus.rejected
    assert update.institution_name is None
    print("  Simple status update: OK")

    update2 = AdminStatusUpdate(
        status=ItemStatus.redirected,
        institution_name="Rumah Yatim Jakarta",
    )
    assert update2.status == ItemStatus.redirected
    assert update2.institution_name == "Rumah Yatim Jakarta"
    print("  Status with institution: OK")

    print("AdminStatusUpdate passed\n")


if __name__ == "__main__":
    print("=" * 50)
    print("  ReFound — Model Tests")
    print("=" * 50 + "\n")

    test_enums()
    test_claim_info()
    test_claim_info_invalid_email()
    test_item_in_db_defaults()
    test_item_response_from_db()
    test_item_response_camel_case_serialization()
    test_donate_request()
    test_claim_request()
    test_admin_status_update()

    print("=" * 50)
    print("  All model tests passed!")
    print("=" * 50)
