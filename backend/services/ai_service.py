import requests
import random
from flask import current_app

def generate_planet_image(prompt):
    api_key = current_app.config['MODELS_LAB_API_KEY']
    if not api_key:
        # mock image data
        return b'mock-image-data'
    url = "https://modelslab.com/api/v6/realtime/text2img"
    payload = {
        "key": api_key,
        "prompt": f"cinematic 4K space art of a planet: {prompt}, astrophotography, hyperrealistic",
        "negative_prompt": "blurry, low quality",
        "width": 512, "height": 512,
        "samples": 1
    }
    resp = requests.post(url, json=payload)
    if resp.status_code == 200:
        image_url = resp.json()['output'][0]
        return requests.get(image_url).content
    return None

def extract_style_signature(image_data):
    # Mock: random 10-dim vector
    return [random.random() for _ in range(10)]
