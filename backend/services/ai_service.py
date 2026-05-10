import requests
import random
from flask import current_app

def generate_planet_image(prompt):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        # Return a real placeholder image so generation always shows something
        url = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"
        response = requests.get(url)
        if response.status_code == 200:
            return response.content
        # Fallback if the image URL is unreachable
        return b'mock-image-data'
    
    # Real ModelsLab API call
    try:
        url = "https://modelslab.com/api/v6/realtime/text2img"
        payload = {
            "key": api_key,
            "prompt": f"cinematic 4K space art of a planet: {prompt}, astrophotography, hyperrealistic",
            "negative_prompt": "blurry, low quality",
            "width": 512,
            "height": 512,
            "samples": 1
        }
        resp = requests.post(url, json=payload)
        if resp.status_code == 200:
            image_url = resp.json()['output'][0]
            return requests.get(image_url).content
        return None
    except Exception as e:
        print("ModelsLab error:", e)
        return None

def extract_style_signature(image_data):
    # Mock: random 10-dim vector – in production, use a vision model
    return [random.random() for _ in range(10)]
