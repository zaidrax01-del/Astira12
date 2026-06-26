import requests
import random
from flask import current_app

# ============================================================
#  AI SERVICE – ModelsLab v8 (flux-2-dev)
# ============================================================
#  This file ONLY handles the image generation.
#  The prompt is already created by the Universe Engine
#  (universe_engine.py) and is guaranteed to be a cinematic,
#  planet‑only description.  No fallback images are used.
# ============================================================

def generate_planet_images(prompt: str, num_samples: int = 1):
    """
    Call the ModelsLab v8 API to produce one or more planet images.
    Returns a list of image URLs, or None if the call fails.
    """
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        print("❌ MODELS_LAB_API_KEY not configured")
        return None

    url = "https://modelslab.com/api/v8/images/text-to-image"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model_id": "flux-2-dev",
        "prompt": prompt,
        "width": "1024",
        "height": "1024",
        "num_inference_steps": 30,
        "samples": num_samples,
        "key": api_key,
        # Negative prompt ensures no non‑planet objects appear
        "negative_prompt": (
            "cars, people, humans, faces, buildings, text, letters, vehicles, "
            "spaceships, animals, creatures, anything not a planet"
        ),
    }

    try:
        resp = requests.post(url, headers=headers, json=payload)
        if resp.status_code == 200:
            data = resp.json()
            output = data.get("output", [])
            if not output:
                print("ModelsLab returned empty output")
                return None
            return output[:num_samples]
        else:
            print(f"ModelsLab error {resp.status_code}: {resp.text}")
            return None
    except Exception as e:
        print("ModelsLab exception:", e)
        return None


def generate_planet_image(prompt: str):
    """
    Convenience wrapper – generate exactly one planet image.
    Used by the Fusion Engine and any other legacy code.
    """
    images = generate_planet_images(prompt, 1)
    if images and len(images) > 0:
        return images[0]
    return None


def extract_style_signature(image_url: str):
    """
    Mock style signature for lineage tracking.
    In production this would analyse the image with a vision model.
    """
    return [random.random() for _ in range(10)]
