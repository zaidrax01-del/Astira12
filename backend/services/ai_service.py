import requests
import random
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

MODELS_LAB_URL = "https://modelslab.com/api/v8/images/text-to-image"
TIMEOUT_SECONDS = 90
MAX_RETRIES = 2

def generate_planet_images(prompt: str, num_samples: int = 1):
    """Call ModelsLab v8 and return a list of image URLs."""
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        logger.error("MODELS_LAB_API_KEY missing in configuration")
        return None

    payload = {
        "model_id": "flux-2-dev",
        "prompt": prompt,
        "width": "1024",
        "height": "1024",
        "num_inference_steps": 30,
        "samples": num_samples,
        "key": api_key,
        "negative_prompt": (
            "cars, people, humans, faces, buildings, text, letters, vehicles, "
            "spaceships, animals, creatures, anything not a planet"
        ),
    }

    headers = {"Content-Type": "application/json"}

    for attempt in range(MAX_RETRIES + 1):
        try:
            logger.info(f"ModelsLab request (attempt {attempt+1}): {prompt[:80]}...")
            start = time.time()
            resp = requests.post(MODELS_LAB_URL, headers=headers, json=payload, timeout=TIMEOUT_SECONDS)
            elapsed = time.time() - start
            logger.info(f"ModelsLab response {resp.status_code} in {elapsed:.1f}s")

            if resp.status_code == 200:
                data = resp.json()
                logger.info(f"ModelsLab response keys: {list(data.keys())}")
                logger.info(f"Full response: {data}")

                # Try multiple possible keys for image URLs
                images = None
                for key in ["output", "data", "images", "results", "generated"]:
                    if key in data:
                        images = data[key]
                        break

                # If it's a string, wrap in list
                if isinstance(images, str):
                    images = [images]

                # If it's a dict with URLs
                if isinstance(images, dict):
                    if "url" in images:
                        images = [images["url"]]
                    elif "image_url" in images:
                        images = [images["image_url"]]

                if not images or len(images) == 0:
                    logger.error(f"ModelsLab returned empty output. Keys: {list(data.keys())}")
                    return None

                logger.info(f"Generated {len(images)} image(s)")
                return images[:num_samples]

            # Handle errors
            logger.error(f"ModelsLab error {resp.status_code}: {resp.text}")
            if resp.status_code == 429:
                time.sleep(5)
                continue
            return None

        except Exception as e:
            logger.exception("ModelsLab unexpected error")
            if attempt < MAX_RETRIES:
                time.sleep(2)
                continue
            return None

    return None


def generate_planet_image(prompt: str):
    """Single image – used by fusion engine."""
    images = generate_planet_images(prompt, 1)
    if images and len(images) > 0:
        return images[0]
    return None


def extract_style_signature(image_url: str):
    """Mock style signature for lineage."""
    return [random.random() for _ in range(10)]
