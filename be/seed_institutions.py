"""Seed the `institutions` collection.

Run once after setting up the database:

    python seed_institutions.py

The entries below are PLACEHOLDERS with clearly-marked names. Replace them with
the real institutions your bins actually redistribute to before going live --
the admin map assigns real donated items to whatever is in this collection.
"""

import asyncio

from database import connect_db, close_db, get_institutions_collection

PLACEHOLDER_INSTITUTIONS = [
    {
        "name": "PLACEHOLDER - Nursing Home",
        "address": "Replace with the real address",
        "phone": "Replace with the real phone number",
        "lat": -6.2088,
        "lng": 106.8456,
        "type": "nursing_home",
    },
    {
        "name": "PLACEHOLDER - Orphanage",
        "address": "Replace with the real address",
        "phone": "Replace with the real phone number",
        "lat": -6.1944,
        "lng": 106.8229,
        "type": "orphanage",
    },
]


async def seed():
    await connect_db()
    collection = get_institutions_collection()

    existing = await collection.count_documents({})
    if existing:
        print(f"institutions already has {existing} document(s) - nothing to do.")
        print("Drop the collection first if you want to re-seed.")
    else:
        result = await collection.insert_many(PLACEHOLDER_INSTITUTIONS)
        print(f"Inserted {len(result.inserted_ids)} placeholder institution(s).")
        print("Remember to replace them with real institution details.")

    await close_db()


if __name__ == "__main__":
    asyncio.run(seed())
