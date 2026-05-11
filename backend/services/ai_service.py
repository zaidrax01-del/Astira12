import requests
import random
from flask import current_app

def generate_planet_image(prompt):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        # Return a placeholder image URL when no API key is set
        return "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

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
            # Return the direct image URL from ModelsLab
            image_url = resp.json()['output'][0]
            return image_url
        else:
            print(f"ModelsLab error: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        print("ModelsLab error:", e)
        return None

def extract_style_signature(image_url):
    # Still mock vector; you can replace later with a real vision model
    return [random.random() for _ in range(10)]
