import requests
import random
from flask import current_app

def generate_planet_image(prompt):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

    # Force planet‑only generation with a strong system prompt and negative
    planet_prompt = (
        f"Stunning cinematic 4K space art of a planet: {prompt}. "
        "Isolated planet, no text, no humans, no vehicles, no buildings, "
        "astronomical object only, ultra realistic, astrophotography."
    )
    negative_prompt = (
        "cars, people, humans, faces, buildings, text, letters, vehicles, "
        "spaceships, animals, creatures, anything not a planet"
    )

    try:
        url = "https://modelslab.com/api/v6/realtime/text2img"
        payload = {
            "key": api_key,
            "prompt": planet_prompt,
            "negative_prompt": negative_prompt,
            "width": 512,
            "height": 512,
            "samples": 1,
            "cfg_scale": 7.5,          # stronger adherence to prompt
            "steps": 30,
        }
        resp = requests.post(url, json=payload)
        if resp.status_code == 200:
            image_url = resp.json()['output'][0]
            return image_url
        else:
            print(f"ModelsLab error: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        print("ModelsLab error:", e)
        return None

def extract_style_signature(image_url):
    # Mock vector for lineage – replace later with real vision model
    return [random.random() for _ in range(10)]
