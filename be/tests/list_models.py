import os
import sys
import google.generativeai as genai

# Ensure the 'be' folder is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config import get_settings

def list_available_models():
    settings = get_settings()
    genai.configure(api_key=settings.GEMINI_API_KEY)

    print("Listing available Gemini models:\n")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model Name: {m.name}")
            print(f"Display Name: {m.display_name}")
            print(f"Description: {m.description}\n")

if __name__ == "__main__":
    list_available_models()