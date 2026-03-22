import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

# Global variable to store the active ESP32 connection
esp32_connection: WebSocket = None


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global esp32_connection
    await websocket.accept()
    esp32_connection = websocket
    print("ESP32-CAM Connected!")

    try:
        while True:
            # Receive data from ESP32
            message = await websocket.receive()

            if message["type"] == "websocket.disconnect":
                print("ESP32 Disconnected (message)")
                break

            if "bytes" in message:
                # It's the image!
                with open("tests/capture_image.jpg", "wb") as f:
                    f.write(message["bytes"])
                print("Image Received and saved as 'tests/capture_image.jpg'")

            elif "text" in message:
                print(f"I [ESP32 Message]: {message['text']}")

    except WebSocketDisconnect:
        print("ESP32 Disconnected (graceful)")
    except Exception as e:
        print(f"ESP32 Connection Error: {e}")
    finally:
        print("Cleaning up connection")
        esp32_connection = None


# Endpoints to trigger actions from your browser
@app.get("/command/{cmd}")
async def send_command(cmd: str):
    global esp32_connection
    if esp32_connection:
        command = cmd.upper()  # CAPTURE, YES, or NO
        try:
            await esp32_connection.send_text(command)
            return {"status": "sent", "command": command}
        except Exception as e:
            print(f"Failed to send command: {e}")
            esp32_connection = None
            return {"status": "error", "message": "Connection lost during send"}
    return {"status": "error", "message": "ESP32 not connected"}


if __name__ == "__main__":
    # Run on your local IP so the ESP32 can see it
    uvicorn.run(app, host="0.0.0.0", port=8000)
