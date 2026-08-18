from fastapi import APIRouter

from database import get_institutions_collection
from models.institution import InstitutionResponse

router = APIRouter(prefix="/api/institutions", tags=["Institutions"])


@router.get("", response_model=list[InstitutionResponse])
async def list_institutions():
    """
    List the institutions that expired items can be redistributed to.

    Used by the admin redistribution map. Returns an empty list if the
    collection has not been seeded yet (see be/seed_institutions.py).
    """
    collection = get_institutions_collection()
    cursor = collection.find({}).sort("name", 1)
    docs = await cursor.to_list(length=100)
    return [InstitutionResponse.from_db(doc) for doc in docs]
