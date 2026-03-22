import asyncio
import os
import sys

# Ensure the 'be' folder is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.gemini import analyze_image


async def test_gemini_analysis():
    # Path to a sample image (you can use the one from your previous capture)
    image_path = "tests/capture_image.jpg"

    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found. Please provide a sample image.")
        return

    print(f"Reading image: {image_path}")
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    print("Sending image to Gemini for analysis...")
    try:
        result = await analyze_image(image_bytes)
        print("\n--- Gemini Result ---")
        print(f"Is Valid: {result.get('is_valid')}")
        print(f"Item Name: {result.get('name')}")
        print(f"Category: {result.get('category')}")
        print(f"Condition: {result.get('condition')}")
        print("----------------------")

        if result.get("name") != "Unknown":
            print("\nSuccess! Gemini is responding correctly.")
        else:
            print(
                "\nWarning: Gemini returned a fallback response. Check your API key or image quality."
            )

    except Exception as e:
        print(f"\nError during Gemini analysis: {e}")


if __name__ == "__main__":
    asyncio.run(test_gemini_analysis())
