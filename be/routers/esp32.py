from fastapi import APIRouter

from websocket.esp32 import is_esp32_connected, request_capture

router = APIRouter(prefix="/api/esp32", tags=["ESP32"])


@router.get("/status")
async def esp32_status():
    """Check if the ESP32 is currently connected."""
    return {"connected": is_esp32_connected()}


@router.post("/capture")
async def trigger_capture():
    """
    Trigger the ESP32 to capture a photo and analyze it with Gemini.

    Called by the frontend when the user clicks "I've Inserted the Item".
    Returns the analysis result (accepted/rejected + item details).
    """
    if not is_esp32_connected():
        return {
            "success": False,
            "error": "ESP32 is not connected. Please check the device.",
        }

    result = await request_capture(timeout=30.0)
    return result
