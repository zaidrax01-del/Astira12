import requests
import random
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

GENERATE_URL = "https://modelslab.com/api/v8/images/text-to-image"
TIMEOUT_SECONDS = 20
POLL_INTERVAL = 2
MAX_POLL_ATTEMPTS = 15

def generate_planet_images(prompt: str, num_samples: int = 1):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        logger.error("MODELS_LAB_API_KEY missing")
        return None

    payload = {
        "model_id": "flux-2-dev",
        "prompt": prompt,
        "width": 512,
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
            logger.error(f"Generation request failed {resp.status_code}: {resp.text}")
            return None

        data = resp.json()
        logger.info(f"Generation response keys: {list(data.keys())}")

        # Direct output (synchronous mode)
        for key in ["output", "data", "images"]:
            if key in data:
                images = data[key]
                if isinstance(images, str):
                    return [images]
                if isinstance(images, list) and len(images) > 0:
                    return images[:num_samples]

        # Async mode – use fetch_result URL if available, otherwise construct from id
        fetch_url = data.get("fetch_result")
        if not fetch_url:
            fetch_id = data.get("id")
            if not fetch_id:
                logger.error(f"No fetch_result or id in response: {data}")
                return None
            fetch_url = f"https://modelslab.com/api/v8/images/fetch/{fetch_id}"

        logger.info(f"Polling: {fetch_url}")

        # 2. Poll until images are ready
        for attempt in range(MAX_POLL_ATTEMPTS):
            time.sleep(POLL_INTERVAL)
            try:
                poll_resp = requests.post(
                    fetch_url,
                    headers=headers,
                    json={"key": api_key},
                    timeout=10
                )
                if poll_resp.status_code != 200:
                    logger.warning(f"Poll {attempt+1}: HTTP {poll_resp.status_code}")
                    continue

                poll_data = poll_resp.json()
                status = (poll_data.get("status") or "").lower()
                logger.info(f"Poll {attempt+1}: status={status}, keys={list(poll_data.keys())}")

                if status == "success":
                    # Try all possible image keys
                    images = None
                    for img_key in ["output", "data", "images", "results", "generated"]:
                        if img_key in poll_data:
                            images = poll_data[img_key]
                            break

                    # Also check if the entire response is just a list of URLs
                    if not images and isinstance(poll_data, list):
                        images = poll_data

                    if images:
                        if isinstance(images, str):
                            return [images]
                        if isinstance(images, list) and len(images) > 0:
                            # Ensure we have URL strings
                            valid = [str(u) for u in images[:num_samples] if isinstance(u, str)]
                            if valid:
                                return valid

                    logger.error(f"Status success but no images found. Keys: {list(poll_data.keys())}")
                    return None

                elif status in ("processing", "queued", "pending"):
                    continue
                else:
                    logger.warning(f"Unknown status: {status}")
                    if attempt < 3:  # give it a few more tries for unknown status
                        continue
                    return None

            except Exception as e:
                logger.error(f"Poll error: {e}")
                continue

        logger.error(f"Timeout waiting for {fetch_url}")
        return None

    except Exception as e:
        logger.exception("Unexpected error")
        return None


def generate_planet_image(prompt: str):
    images = generate_planet_images(prompt, 1)
    return images[0] if images else None


def extract_style_signature(image_url: str):
    return [random.random() for _ in range(10)]
