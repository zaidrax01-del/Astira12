import requests
import random
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

GENERATE_URL = "https://modelslab.com/api/v8/images/text-to-image"
FETCH_URL    = "https://modelslab.com/api/v8/images/fetch/{}"
TIMEOUT_SECONDS = 20              # shorter timeout
POLL_INTERVAL = 2                 # check every 2 seconds
MAX_POLL_ATTEMPTS = 15            # total wait ≈ 30 seconds

def generate_planet_images(prompt: str, num_samples: int = 1):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        logger.error("MODELS_LAB_API_KEY missing")
        return None

    payload = {
        "model_id": "flux-2-dev",
        "prompt": prompt,
        "width": 512,              # smaller resolution = faster generation
        "height": 512,
        "num_inference_steps": 20,
        "samples": num_samples,
        "key": api_key,
        "negative_prompt": "cars, people, humans, faces, buildings, text",
    }

    headers = {"Content-Type": "application/json"}

    try:
        # 1. Submit job
        resp = requests.post(GENERATE_URL, headers=headers, json=payload, timeout=TIMEOUT_SECONDS)
        if resp.status_code != 200:
            logger.error(f"Generation request failed {resp.status_code}")
            return None

        data = resp.json()

        # If direct output (sync)
        for key in ["output", "data", "images"]:
            if key in data:
                images = data[key]
                if isinstance(images, str):
                    return [images]
                if isinstance(images, list):
                    return images[:num_samples]

        # Async mode
        fetch_id = data.get("id")
        if not fetch_id:
            logger.error(f"No 'id' in response: {data}")
            return None

        logger.info(f"Async generation id: {fetch_id}")

        # 2. Poll
        for attempt in range(MAX_POLL_ATTEMPTS):
            time.sleep(POLL_INTERVAL)
            try:
                poll_resp = requests.post(
                    FETCH_URL.format(fetch_id),
                    headers=headers,
                    json={"key": api_key},
                    timeout=10
                )
                if poll_resp.status_code != 200:
                    continue

                poll_data = poll_resp.json()
                status = (poll_data.get("status") or "").lower()

                if status == "success":
                    images = poll_data.get("output") or poll_data.get("data") or []
                    if isinstance(images, str):
                        return [images]
                    if isinstance(images, list):
                        return images[:num_samples]
                    return None
                elif status in ("processing", "queued"):
                    continue
                else:
                    logger.warning(f"Unknown status: {status}")
            except Exception:
                continue

        logger.error(f"Timeout for id {fetch_id}")
        return None

    except Exception as e:
        logger.exception("Unexpected error")
        return None


def generate_planet_image(prompt: str):
    images = generate_planet_images(prompt, 1)
    return images[0] if images else None


def extract_style_signature(image_url: str):
    return [random.random() for _ in range(10)]
