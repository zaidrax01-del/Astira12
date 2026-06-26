import requests
import random
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

# =========================  MODELS LAB V8  =========================
MODELS_LAB_URL = "https://modelslab.com/api/v8/images/text-to-image"
TIMEOUT_SECONDS = 90          # generous timeout for AI generation
MAX_RETRIES = 2               # retry once on network errors

def generate_planet_images(prompt: str, num_samples: int = 1):
    """
    Call the official ModelsLab v8 text‑to‑image endpoint.
    Returns a list of image URLs, or None if anything fails.
    """
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
            resp = requests.post(
                MODELS_LAB_URL,
                headers=headers,
                json=payload,
                timeout=TIMEOUT_SECONDS
            )
            elapsed = time.time() - start
            logger.info(f"ModelsLab response {resp.status_code} in {elapsed:.1f}s")

            # Success
            if resp.status_code == 200:
                data = resp.json()
                output = data.get("output", [])
                if not output:
                    logger.error("ModelsLab returned empty output")
                    return None
                logger.info(f"Generated {len(output)} image(s)")
                return output[:num_samples]

            # Handle known error codes
            if resp.status_code == 400:
                logger.error(f"ModelsLab 400: {resp.text}")
                return None
            if resp.status_code == 401:
                logger.error("ModelsLab 401 – invalid API key")
                return None
            if resp.status_code == 429:
                logger.warning("ModelsLab 429 – rate limited, retrying after delay")
                time.sleep(5)
                continue
            if resp.status_code >= 500:
                logger.error(f"ModelsLab server error {resp.status_code}: {resp.text}")
                if attempt == MAX_RETRIES:
                    return None
                time.sleep(2)
                continue

            # Unexpected status
            logger.error(f"ModelsLab unexpected status {resp.status_code}: {resp.text}")
            return None

        except requests.exceptions.Timeout:
            logger.error("ModelsLab request timed out")
            if attempt == MAX_RETRIES:
                return None
            time.sleep(2)
        except requests.exceptions.ConnectionError:
            logger.error("ModelsLab connection error")
            if attempt == MAX_RETRIES:
                return None
            time.sleep(5)
        except Exception as e:
            logger.exception("ModelsLab unexpected error")
            return None

    return None


def generate_planet_image(prompt: str):
    """Convenience wrapper – single image (used by fusion engine)."""
    images = generate_planet_images(prompt, 1)
    if images and len(images) > 0:
        return images[0]
    return None


def extract_style_signature(image_url: str):
    """Mock style signature for lineage tracking."""
    return [random.random() for _ in range(10)]
