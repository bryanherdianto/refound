import json
import asyncio
from functools import partial

import google.generativeai as genai

from config import get_settings

_model = None


def _get_model():
    global _model
    if _model is None:
        settings = get_settings()
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _model = genai.GenerativeModel("gemini-3-flash-preview")
    return _model


# ---------------------------------------------------------------------------
# ESP32 Image Analysis - Quick yes/no validation
# ---------------------------------------------------------------------------

_VALIDATION_PROMPT = """You are part of an automated donation box system.
Analyze this image captured by an ESP32 camera inside a donation receptacle.

Determine if the object in the image is a valid, reusable item suitable for donation
(e.g. electronics, stationery, toys, clothing, household items).

Reject trash, food waste, hazardous materials, or empty/unclear images.

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "is_valid": true/false,
  "name": "short item name",
  "category": "one of: Electronics, Stationery, Toys, Clothing, Household, Accessories, Other",
  "condition": "brief condition note, e.g. Good condition, Slightly used",
}"""


async def analyze_image(image_bytes: bytes) -> dict:
    """
    Send an image to Gemini Vision and get a structured analysis.

    Returns dict with keys: is_valid, name, category, condition.
    """
    model = _get_model()

    image_part = {
        "mime_type": "image/jpeg",
        "data": image_bytes,
    }

    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        partial(
            model.generate_content,
            [_VALIDATION_PROMPT, image_part],
        ),
    )

    # Parse the JSON response from Gemini
    text = response.text.strip()
    # Remove markdown code fences if Gemini wraps the response
    if text.startswith("```"):
        text = text.split("\n", 1)[1]  # remove first line
        text = text.rsplit("```", 1)[0]  # remove last fence
        text = text.strip()

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        # Fallback: treat as invalid
        result = {
            "is_valid": False,
            "name": "Unknown",
            "category": "Other",
            "condition": "Could not analyze",
        }

    return result


# ---------------------------------------------------------------------------
# Photo Analysis - Richer analysis for uploaded donation photos
# ---------------------------------------------------------------------------

_PHOTO_PROMPT = """Analyze this photograph of a donated item.
Provide a detailed assessment for a donation platform.

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "name": "descriptive item name",
  "category": "one of: Electronics, Stationery, Toys, Clothing, Household, Accessories, Other",
  "condition": "brief condition description",
}"""


async def analyze_photo(image_bytes: bytes) -> dict:
    """Analyze an uploaded donation photo for item metadata."""
    model = _get_model()

    image_part = {
        "mime_type": "image/jpeg",
        "data": image_bytes,
    }

    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        partial(
            model.generate_content,
            [_PHOTO_PROMPT, image_part],
        ),
    )

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
        text = text.strip()

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        result = {
            "name": "Donated Item",
            "category": "Other",
            "condition": "Unverified",
        }

    return result
