"""
Integration tests for the ReFound API endpoints.

Uses FastAPI TestClient with a real MongoDB connection (your .env database).
This tests the full request/response cycle including DB operations.

Run: python tests/test_api.py
"""

import asyncio
import os
import sys
from datetime import datetime, timezone

# Ensure the 'be' folder is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from bson import ObjectId
from httpx import AsyncClient, ASGITransport

from database import connect_db, close_db, get_items_collection
from main import app


# ---------------------------------------------------------------------------
# Helper: seed a test item directly into MongoDB
# ---------------------------------------------------------------------------


async def seed_item(overrides: dict = None) -> str:
    """Insert a test item and return its string ID."""
    collection = get_items_collection()

    doc = {
        "name": "Test Item",
        "image": "https://example.com/test.jpg",
        "front_image": None,
        "back_image": None,
        "detected_at": datetime.now(timezone.utc),
        "status": "available",
        "condition": "Good condition",
        "category": "Electronics",
        "size": "small",
        "donor_name": "Test Donor",
        "donor_email": "donor@test.com",
        "agreed_to_redistribution": True,
        "claimed_by": None,
        "assigned_institution": None,
        "reward_points": 10,
    }

    if overrides:
        doc.update(overrides)

    result = await collection.insert_one(doc)
    return str(result.inserted_id)


async def cleanup_test_items():
    """Remove all test items created during testing."""
    collection = get_items_collection()
    result = await collection.delete_many({"donor_email": {"$regex": "test\\.com$"}})
    print(f"  Cleaned up {result.deleted_count} test item(s)")


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


async def test_health_check(client: AsyncClient):
    """Test GET / health endpoint."""
    print("--- Testing Health Check ---")

    resp = await client.get("/")
    assert resp.status_code == 200

    data = resp.json()
    assert data["status"] == "ok"
    assert data["service"] == "ReFound Backend"
    print("  Health check: OK")
    print("Health check passed\n")


async def test_list_items(client: AsyncClient):
    """Test GET /api/items with and without status filter."""
    print("--- Testing List Items ---")

    # Seed some items
    await seed_item({"name": "Available Widget", "status": "available"})
    await seed_item({"name": "Claimed Gadget", "status": "claimed"})

    # List all
    resp = await client.get("/api/items")
    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    assert len(items) >= 2
    print(f"  List all: {len(items)} item(s) returned")

    # Filter by status
    resp2 = await client.get("/api/items?status=available")
    assert resp2.status_code == 200
    available = resp2.json()
    for item in available:
        assert item["status"] == "available", (
            f"Expected available, got {item['status']}"
        )
    print(f"  Filter available: {len(available)} item(s)")

    # Verify camelCase keys in response
    if available:
        sample = available[0]
        assert "detectedAt" in sample, "Missing camelCase key: detectedAt"
        assert "donorName" in sample, "Missing camelCase key: donorName"
    print("  camelCase keys: OK")

    print("List items passed\n")


async def test_get_single_item(client: AsyncClient):
    """Test GET /api/items/{id}."""
    print("--- Testing Get Single Item ---")

    item_id = await seed_item({"name": "Single Fetch Test"})

    resp = await client.get(f"/api/items/{item_id}")
    assert resp.status_code == 200

    data = resp.json()
    assert data["id"] == item_id
    assert data["name"] == "Single Fetch Test"
    print(f"  Get item {item_id[:8]}...: OK")

    # Non-existent ID
    fake_id = str(ObjectId())
    resp2 = await client.get(f"/api/items/{fake_id}")
    assert resp2.status_code == 404
    print("  Non-existent item: 404 OK")

    # Invalid ID format
    resp3 = await client.get("/api/items/not-a-valid-id")
    assert resp3.status_code == 400
    print("  Invalid ID format: 400 OK")

    print("Get single item passed\n")


async def test_donate_small_item(client: AsyncClient):
    """Test POST /api/donate for a small item (no photos)."""
    print("--- Testing Donate Small Item ---")

    resp = await client.post(
        "/api/donate",
        data={
            "size": "small",
            "donor_name": "Integration Tester",
            "donor_email": "integration@test.com",
            "agreed_to_redistribution": "true",
            "description": "Blue Ballpoint Pen",
            "category": "Stationery",
        },
    )

    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    data = resp.json()
    assert data["name"] == "Blue Ballpoint Pen"
    assert data["status"] == "available"
    assert data["size"] == "small"
    assert data["donorName"] == "Integration Tester"
    print(f"  Created item: {data['id'][:8]}...")
    print(f"  Name: {data['name']}, Category: {data['category']}")

    print("Donate small item passed\n")


async def test_claim_item(client: AsyncClient):
    """Test POST /api/claim/{id}."""
    print("--- Testing Claim Item ---")

    # Seed an available item
    item_id = await seed_item({"name": "Claimable Item", "status": "available"})

    resp = await client.post(
        f"/api/claim/{item_id}",
        json={
            "name": "Claimer Person",
            "email": "claimer@test.com",
            "phone": "+62 812 1234 5678",
            "method": "pickup",
            "pickup_point": "canteen",
        },
    )

    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

    data = resp.json()
    assert data["status"] == "claimed"
    assert data["claimedBy"] is not None
    assert data["claimedBy"]["name"] == "Claimer Person"
    assert data["claimedBy"]["pickupPoint"] == "canteen"
    print(f"  Claimed item {item_id[:8]}...")
    print(f"  Claimed by: {data['claimedBy']['name']}")

    # Try claiming again — should fail with 409
    resp2 = await client.post(
        f"/api/claim/{item_id}",
        json={
            "name": "Another Person",
            "email": "another@test.com",
            "phone": "+62 000",
            "method": "delivery",
            "address": "Some address",
        },
    )
    assert resp2.status_code == 409
    print("  Double-claim rejected: 409 OK")

    print("Claim item passed\n")


async def test_claim_with_delivery(client: AsyncClient):
    """Test claiming with delivery method."""
    print("--- Testing Claim with Delivery ---")

    item_id = await seed_item({"name": "Delivery Test Item", "status": "available"})

    resp = await client.post(
        f"/api/claim/{item_id}",
        json={
            "name": "Delivery Tester",
            "email": "delivery@test.com",
            "phone": "+62 000 111 2222",
            "method": "delivery",
            "address": "Jl. Sudirman No. 1, Jakarta",
        },
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["claimedBy"]["method"] == "delivery"
    print("  Delivery claim: OK")

    print("Claim with delivery passed\n")


async def test_admin_list_items(client: AsyncClient):
    """Test GET /api/admin/items returns all items."""
    print("--- Testing Admin List Items ---")

    resp = await client.get("/api/admin/items")
    assert resp.status_code == 200

    items = resp.json()
    assert isinstance(items, list)
    print(f"  Admin sees {len(items)} total item(s)")

    print("Admin list items passed\n")


async def test_admin_update_status(client: AsyncClient):
    """Test PATCH /api/admin/items/{id}/status."""
    print("--- Testing Admin Status Update ---")

    item_id = await seed_item({"name": "Admin Status Test", "status": "waiting"})

    # Approve (set to available)
    resp = await client.patch(
        f"/api/admin/items/{item_id}/status",
        json={"status": "available"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "available"
    print("  Approve (waiting → available): OK")

    # Reject
    resp2 = await client.patch(
        f"/api/admin/items/{item_id}/status",
        json={"status": "rejected"},
    )
    assert resp2.status_code == 200
    assert resp2.json()["status"] == "rejected"
    print("  Reject: OK")

    print("Admin status update passed\n")


async def test_admin_assign_to_institution(client: AsyncClient):
    """Test POST /api/admin/items/{id}/assign."""
    print("--- Testing Admin Assign to Institution ---")

    item_id = await seed_item({"name": "Expired Widget", "status": "expired"})

    resp = await client.post(
        f"/api/admin/items/{item_id}/assign",
        params={"institution_name": "Panti Asuhan Kasih"},
    )
    assert resp.status_code == 200

    data = resp.json()
    assert data["status"] == "redirected"
    print(f"  Assigned to institution: OK (status={data['status']})")

    # Try assigning a claimed item — should fail
    claimed_id = await seed_item({"name": "Claimed Item", "status": "claimed"})
    resp2 = await client.post(
        f"/api/admin/items/{claimed_id}/assign",
        params={"institution_name": "Some Place"},
    )
    assert resp2.status_code == 409
    print("  Assign claimed item: 409 OK")

    print("Admin assign passed\n")


async def test_admin_complete(client: AsyncClient):
    """Test PATCH /api/admin/items/{id}/complete."""
    print("--- Testing Admin Complete ---")

    item_id = await seed_item({"name": "Redirected Widget", "status": "redirected"})

    resp = await client.patch(f"/api/admin/items/{item_id}/complete")
    assert resp.status_code == 200
    assert resp.json()["status"] == "completed"
    print("  Complete (redirected → completed): OK")

    # Non-redirected item — should fail
    waiting_id = await seed_item({"name": "Waiting Item", "status": "waiting"})
    resp2 = await client.patch(f"/api/admin/items/{waiting_id}/complete")
    assert resp2.status_code == 409
    print("  Complete non-redirected: 409 OK")

    print("Admin complete passed\n")


async def test_tracking(client: AsyncClient):
    """Test GET /api/tracking?email=..."""
    print("--- Testing Tracking ---")

    # Seed a claimed item
    await seed_item(
        {
            "name": "Tracked Item",
            "status": "claimed",
            "claimed_by": {
                "name": "Tracker",
                "email": "tracker@test.com",
                "phone": "+62 000",
                "method": "pickup",
                "pickup_point": "lobby",
                "claimed_at": datetime.now(timezone.utc),
                "picked_up_at": None,
            },
        }
    )

    resp = await client.get("/api/tracking?email=tracker@test.com")
    assert resp.status_code == 200

    items = resp.json()
    assert len(items) >= 1
    assert items[0]["claimedBy"]["email"] == "tracker@test.com"
    print(f"  Found {len(items)} tracked item(s) for tracker@test.com")

    # Non-existent email
    resp2 = await client.get("/api/tracking?email=nobody@nowhere.com")
    assert resp2.status_code == 200
    assert resp2.json() == []
    print("  Non-existent email: empty list OK")

    print("Tracking passed\n")


# ---------------------------------------------------------------------------
# Main runner
# ---------------------------------------------------------------------------


async def run_all_tests():
    print("=" * 55)
    print("  ReFound — API Integration Tests")
    print("=" * 55 + "\n")

    # Connect to the real database
    print("Connecting to MongoDB...")
    await connect_db()
    print()

    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        try:
            await test_health_check(client)
            await test_list_items(client)
            await test_get_single_item(client)
            await test_donate_small_item(client)
            await test_claim_item(client)
            await test_claim_with_delivery(client)
            await test_admin_list_items(client)
            await test_admin_update_status(client)
            await test_admin_assign_to_institution(client)
            await test_admin_complete(client)
            await test_tracking(client)
        finally:
            # Clean up test data
            print("-" * 55)
            print("Cleaning up test data...")
            await cleanup_test_items()

    await close_db()

    print("\n" + "=" * 55)
    print("  All API tests passed!")
    print("=" * 55)


if __name__ == "__main__":
    asyncio.run(run_all_tests())
