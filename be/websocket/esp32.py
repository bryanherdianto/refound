import asyncio
from datetime import datetime

from fastapi import WebSocket, WebSocketDisconnect

from database import get_items_collection
from services.gemini import analyze_image
from services.s3 import upload_image_bytes

# Store the active ESP32 connection
_esp32_ws: WebSocket | None = None
_pending_item: dict | None = None


async def esp32_websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for ESP32 camera module communication.

    Protocol:
    1. On connect: server sends "CAPTURE" to trigger ESP32 camera
    2. ESP32 sends binary image data
    3. Server analyzes via Gemini, replies "YES" or "NO"
    4. If YES, ESP32 opens accept servo, item drops in, ESP32 sends "DEPOSITED_OK"
    5. Server creates item in DB with status "available"
    """
    global _esp32_ws, _pending_item

    await websocket.accept()
    _esp32_ws = websocket
    print("🔌 ESP32-CAM Connected!")

    try:
        # Send initial capture command
        await websocket.send_text("CAPTURE")
        print("Sent CAPTURE command to ESP32")

        while True:
            # Receive data from ESP32
            message = await websocket.receive()

            if message["type"] == "websocket.disconnect":
                print("ESP32 Disconnected (message)")
                break

            if "bytes" in message and message["bytes"]:
                # Binary message = camera image from ESP32
                image_bytes = message["bytes"]
                print(f"Image Received from ESP32 ({len(image_bytes)} bytes)")

                try:
                    # Analyze with Gemini
                    analysis = await analyze_image(image_bytes)
                    print(f"Gemini analysis: {analysis}")

                    if analysis.get("is_valid", False):
                        # Upload image to S3
                        image_url = await upload_image_bytes(image_bytes)
                        print(f"Image uploaded to S3: {image_url}")

                        # Store pending item info until DEPOSITED_OK
                        _pending_item = {
                            "name": analysis.get("name", "Detected Item"),
                            "image": image_url,
                            "category": analysis.get("category", "Other"),
                            "condition": analysis.get("condition", "Unverified"),
                            "size": "small",
                            "status": "waiting",
                            "detected_at": datetime.now(datetime.timezone.utc),
                            "donor_name": None,
                            "donor_email": None,
                            "front_image": None,
                            "back_image": None,
                            "agreed_to_redistribution": False,
                            "claimed_by": None,
                            "assigned_institution": None,
                            "reward_points": 10,
                        }

                        await websocket.send_text("YES")
                        print("Sent YES to ESP32 (accept item)")
                    else:
                        await websocket.send_text("NO")
                        print("Sent NO to ESP32 (reject item)")

                except Exception as e:
                    print(f"Error processing image: {e}")
                    await websocket.send_text("NO")

            elif "text" in message and message["text"]:
                text = message["text"].strip()
                print(f"I [ESP32 Message]: {text}")

                if text == "DEPOSITED_OK":
                    # Item has been physically inserted into the box
                    if _pending_item:
                        _pending_item["status"] = "available"
                        collection = get_items_collection()
                        result = await collection.insert_one(_pending_item)
                        print(f"Item saved to DB: {result.inserted_id}")
                        _pending_item = None
                    else:
                        print("DEPOSITED_OK received but no pending item")

                    # Ready for next item — send CAPTURE again
                    await asyncio.sleep(2)
                    await websocket.send_text("CAPTURE")
                    print("Sent CAPTURE command for next item")

    except WebSocketDisconnect:
        print("ESP32 Disconnected (graceful)")
    except Exception as e:
        print(f"ESP32 Connection Error: {e}")
    finally:
        print("Cleaning up connection")
        _esp32_ws = None
