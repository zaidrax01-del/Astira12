import requests
import random
from flask import current_app

FALLBACK_IMAGE = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

def generate_planet_images(prompt, num_samples=1):
    """
    Call ModelsLab v8 with a short timeout.
    If anything fails or takes too long, return the fallback image.
    """
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return [FALLBACK_IMAGE] * num_samples

    try:
        resp = requests.post(
            "https://modelslab.com/api/v8/images/text-to-image",
            json={
                "model_id": "flux-2-dev",
                "prompt": prompt,
                "width": 512,
                "height": 512,
                "num_inference_steps": 20,
                "samples": num_samples,
                "key": api_key,
                "negative_prompt": "cars, people, humans, faces, buildings, text"
            },
            timeout=15   # short timeout so Render worker isn't killed
        )
        if resp.status_code == 200:
            data = resp.json()
            # Try synchronous output first
            for key in ["output", "data", "images"]:
                if key in data:
                    imgs = data[key]
                    if isinstance(imgs, str):
                        return [imgs]
                    if isinstance(imgs, list) and len(imgs) > 0:
                        return imgs[:num_samples]
            # If async, try polling once quickly
            fetch_url = data.get("fetch_result")
            if fetch_url:
                poll = requests.post(fetch_url, json={"key": api_key}, timeout=10)
                if poll.status_code == 200:
                    pdata = poll.json()
                    if pdata.get("status") == "success":
                        imgs = pdata.get("output") or pdata.get("data") or []
                        if isinstance(imgs, str):
                            return [imgs]
                        if isinstance(imgs, list):
                            return imgs[:num_samples]
    except Exception:
        pass

    # Anything fails → fallback
    return [FALLBACK_IMAGE] * num_samples


def generate_planet_image(prompt):
    """Single image wrapper – used by fusion engine."""
    imgs = generate_planet_images(prompt, 1)
    return imgs[0] if imgs else FALLBACK_IMAGE


def extract_style_signature(image_url):
    """Mock style signature for lineage."""
    return [random.random() for _ in range(10)]
