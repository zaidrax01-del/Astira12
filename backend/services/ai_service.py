# backend/services/ai_service.py
import requests
import random
from flask import current_app

def generate_planet_images(prompt, num_samples=5):
    """Generate multiple planet images using the ModelsLab API.
    Returns a list of image URLs, or None if generation fails or no API key is set.
    """
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        # No API key → no fallback – return None so the route returns a 500 error
        print("ERROR: MODELS_LAB_API_KEY not configured")
        return None

    try:
        url = "https://modelslab.com/api/v6/realtime/text2img"
        payload = {
            "key": api_key,
            "prompt": f"cinematic 4K space art of a planet: {prompt}, astrophotography, hyperrealistic",
            "negative_prompt": "cars, people, humans, faces, buildings, text, letters, vehicles, spaceships, animals, creatures, anything not a planet",
            "width": 512,
            "height": 512,
            "samples": num_samples,
            "cfg_scale": 7.5,
            "steps": 30,
        }
        resp = requests.post(url, json=payload)
        if resp.status_code == 200:
            output = resp.json().get('output', [])
            if not output:
                print("ModelsLab returned empty output")
                return None
            return output[:num_samples]
        else:
            print(f"ModelsLab error: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        print("ModelsLab error:", e)
        return None


def extract_style_signature(image_url):
    """Generate a mock style signature for lineage tracking.
    In production this would use a vision model to extract real features.
    """
    return [random.random() for _ in range(10)]
