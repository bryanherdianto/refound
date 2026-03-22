import asyncio
from datetime import datetime, timezone

from fastapi import WebSocket, WebSocketDisconnect
from bson import ObjectId

from database import get_items_collection
from services.gemini import analyze_image
from services.s3 import upload_image_bytes

# ---------------------------------------------------------------------------
# Module-level state shared between WebSocket handler and REST endpoints
# ---------------------------------------------------------------------------
_esp32_ws: WebSocket | None = None
_pending_item_id: str | None = None

# asyncio.Event used by the REST endpoint to signal "send CAPTURE"
_capture_requested = asyncio.Event()
# asyncio.Event used to signal that analysis is done
_capture_done = asyncio.Event()
# Stores the latest analysis result so the REST endpoint can return it
_last_result: dict = {}


# ---------------------------------------------------------------------------
# Public API for the REST router
# ---------------------------------------------------------------------------

def is_esp32_connected() -> bool:
    return _esp32_ws is not None


async def request_capture(timeout: float = 30.0) -> dict:
    """
    Called by the REST endpoint when the frontend says "I've inserted the item".
    Signals the WebSocket loop to send CAPTURE, then waits for the result.
    Returns the Gemini analysis dict or an error.
    """
    global _last_result

    if _esp32_ws is None:
        return {"success": False, "error": "ESP32 not connected"}

    # Reset events
    _capture_done.clear()
    _last_result = {}

    # Signal the WS loop to send CAPTURE
    _capture_requested.set()

    # Wait for the WS loop to finish processing and set _capture_done
    try:
        await asyncio.wait_for(_capture_done.wait(), timeout=timeout)
    except asyncio.TimeoutError:
        return {"success": False, "error": "ESP32 capture timed out"}

    return _last_result


# ---------------------------------------------------------------------------
# WebSocket handler
# ---------------------------------------------------------------------------

async def esp32_websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for ESP32 camera module communication.

    Protocol:
    1. ESP32 connects, server waits for a capture request from the frontend
    2. Frontend calls POST /api/esp32/capture → sets _capture_requested event
    3. Server sends "CAPTURE" to ESP32
    4. ESP32 sends binary image data
    5. Server analyzes via Gemini, replies "YES" or "NO"
    6. If YES, ESP32 opens servo, item drops in, ESP32 sends "DEPOSITED_OK"
    7. Server creates item in DB with status "available"
    """
    global _esp32_ws, _pending_item_id, _last_result

    await websocket.accept()
    _esp32_ws = websocket
    print("ESP32-CAM Connected!")

    try:
        while True:
            # -----------------------------------------------------------
            # Wait for EITHER a capture request from the frontend
            # OR a message from the ESP32 (e.g., DEPOSITED_OK)
            # -----------------------------------------------------------
            ws_receive = asyncio.ensure_future(websocket.receive())
            capture_wait = asyncio.ensure_future(_capture_requested.wait())

            done, pending = await asyncio.wait(
                {ws_receive, capture_wait},
                return_when=asyncio.FIRST_COMPLETED,
            )

            # Cancel whichever didn't finish
            for task in pending:
                task.cancel()

            # -- Handle capture request from frontend --
            if capture_wait in done:
                _capture_requested.clear()
                try:
                    await websocket.send_text("CAPTURE")
                    print("Sent CAPTURE command to ESP32 (triggered by frontend)")
                except Exception as e:
                    _last_result = {"success": False, "error": str(e)}
                    _capture_done.set()
                continue

            # -- Handle message from ESP32 --
            if ws_receive in done:
                message = ws_receive.result()

                if message["type"] == "websocket.disconnect":
                    print("ESP32 Disconnected (message)")
                    break

                if "bytes" in message and message["bytes"]:
                    image_bytes = message["bytes"]
                    print(f"Image Received from ESP32 ({len(image_bytes)} bytes)")

                    try:
                        analysis = await analyze_image(image_bytes)
                        print(f"Gemini analysis: {analysis}")

                        if analysis.get("is_valid", False):
                            image_url = await upload_image_bytes(image_bytes)
                            print(f"Image uploaded to S3: {image_url}")

                            # Save item to DB immediately (status=waiting)
                            item_doc = {
                                "name": analysis.get("name", "Detected Item"),
                                "image": image_url,
                                "category": analysis.get("category", "Other"),
                                "condition": analysis.get("condition", "Unverified"),
                                "size": "small",
                                "status": "waiting",
                                "detected_at": datetime.now(timezone.utc),
                                "donor_name": None,
                                "donor_email": None,
                                "front_image": None,
                                "back_image": None,
                                "agreed_to_redistribution": False,
                                "claimed_by": None,
                                "assigned_institution": None,
                                "reward_points": 10,
                            }
                            collection = get_items_collection()
                            result = await collection.insert_one(item_doc)
                            item_id = str(result.inserted_id)
                            _pending_item_id = item_id
                            print(f"Item saved to DB: {item_id}")

                            await websocket.send_text("YES")
                            print("Sent YES to ESP32 (accept item)")

                            _last_result = {
                                "success": True,
                                "accepted": True,
                                "item_id": item_id,
                                "name": analysis.get("name", "Detected Item"),
                                "category": analysis.get("category", "Other"),
                                "condition": analysis.get("condition", "Unverified"),
                                "image": image_url,
                            }
                        else:
                            await websocket.send_text("NO")
                            print("Sent NO to ESP32 (reject item)")

                            _last_result = {
                                "success": True,
                                "accepted": False,
                                "reason": "Item not eligible for donation",
                            }

                        # Signal the REST endpoint that analysis is done
                        _capture_done.set()

                    except Exception as e:
                        print(f"Error processing image: {e}")
                        await websocket.send_text("NO")
                        _last_result = {"success": False, "error": str(e)}
                        _capture_done.set()

                elif "text" in message and message["text"]:
                    text = message["text"].strip()
                    print(f"ESP32 Message: {text}")

                    if text == "DEPOSITED_OK":
                        # Item already saved — just update status to available
                        if _pending_item_id:
                            collection = get_items_collection()
                            await collection.update_one(
                                {"_id": ObjectId(_pending_item_id)},
                                {"$set": {"status": "available"}},
                            )
                            print(f"Item {_pending_item_id} status → available")
                            _pending_item_id = None
                        else:
                            print("DEPOSITED_OK received but no pending item")

    except WebSocketDisconnect:
        print("ESP32 Disconnected (graceful)")
    except Exception as e:
        print(f"ESP32 Connection Error: {e}")
    finally:
        print("Cleaning up ESP32 connection")
        _esp32_ws = None
