from enum import Enum

from pydantic import BaseModel, Field


class InstitutionType(str, Enum):
    orphanage = "orphanage"
    nursing_home = "nursing_home"


class InstitutionResponse(BaseModel):
    """A local institution that expired items can be redistributed to.

    Field names match the `Institution` interface the frontend map component
    already expects, so no reshaping is needed on the client.
    """
    id: str
    name: str
    address: str
    phone: str
    lat: float
    lng: float
    type: InstitutionType

    class Config:
        from_attributes = True

    @classmethod
    def from_db(cls, doc: dict) -> "InstitutionResponse":
        return cls(
            id=str(doc.get("_id", doc.get("id", ""))),
            name=doc.get("name", ""),
            address=doc.get("address", ""),
            phone=doc.get("phone", ""),
            lat=doc.get("lat", 0.0),
            lng=doc.get("lng", 0.0),
            type=doc.get("type", InstitutionType.orphanage),
        )
