import requests
import random
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

GENERATE_URL = "https://modelslab.com/api/v8/images/text-to-image"
FETCH_URL    = "https://modelslab.com/api/v8/images/fetch/{}"   # {} will be replaced by id
TIMEOUT_SECONDS = 90
POLL_INTERVAL = 3          # seconds between polls
MAX_POLL_ATTEMPTS = 20     # total wait ≈ 60 seconds

def generate_planet_images(prompt: str, num_samples: int = 1):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        logger.error("MODELS_LAB_API_KEY missing in configuration")
        return None

    # 1. Submit generation job
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

    try:
        resp = requests.post(GENERATE_URL, headers=headers, json=payload, timeout=30)
        if resp.status_code != 200:
            logger.error(f"Generation request failed {resp.status_code}: {resp.text}")
            return None

        data = resp.json()
        logger.info(f"Generation response keys: {list(data.keys())}")

        # If images are directly returned (synchronous), use them
        for key in ["output", "data", "images", "results"]:
            if key in data:
                images = data[key]
                if isinstance(images, str):
                    return [images]
                if isinstance(images, list):
                    return images[:num_samples]

        # Async mode – we need to poll fetch_result
        fetch_id = data.get("id")
        if not fetch_id:
            logger.error(f"No 'id' in response. Full data: {data}")
            return None

        logger.info(f"Async generation started, id: {fetch_id}")

        # 2. Poll until images are ready
        fetch_url = FETCH_URL.format(fetch_id)
        for attempt in range(MAX_POLL_ATTEMPTS):
            time.sleep(POLL_INTERVAL)
            try:
                poll_resp = requests.post(
                    fetch_url,
                    headers={"Content-Type": "application/json"},
                    json={"key": api_key},
                    timeout=30
                )
                if poll_resp.status_code != 200:
                    logger.warning(f"Poll attempt {attempt+1}: HTTP {poll_resp.status_code}")
                    continue

                poll_data = poll_resp.json()
                status = poll_data.get("status", "").lower()

                if status == "success":
                    images = poll_data.get("output") or poll_data.get("data") or poll_data.get("images")
                    if images:
                        if isinstance(images, str):
                            return [images]
                        if isinstance(images, list):
                            return images[:num_samples]
                    return None
                elif status in ("processing", "queued", "pending"):
                    logger.info(f"Poll {attempt+1}: status={status}")
                    continue
                else:
                    logger.warning(f"Unknown status '{status}'")
            except Exception as e:
                logger.error(f"Poll error: {e}")

        logger.error(f"Timeout waiting for generation (id {fetch_id})")
        return None

    except Exception as e:
        logger.exception("Unexpected error in generate_planet_images")
        return None


def generate_planet_image(prompt: str):
    images = generate_planet_images(prompt, 1)
    if images and len(images) > 0:
        return images[0]
    return None


def extract_style_signature(image_url: str):
    return [random.random() for _ in range(10)]
