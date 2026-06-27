import requests
import random
import time
from flask import current_app

FALLBACK_IMAGE = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"
GENERATE_URL = "https://modelslab.com/api/v8/images/text-to-image"
POLL_INTERVAL = 3       # seconds between polls
MAX_POLL_TIME = 30      # total seconds to wait

def generate_planet_images(prompt, num_samples=1):
    """
    Call ModelsLab v8 synchronously.
    If the API returns an async job, poll until it's done.
    Fall back to the placeholder image only if everything fails.
    """
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return [FALLBACK_IMAGE] * num_samples

    payload = {
        "model_id": "flux-2-dev",
        "prompt": prompt,
        "width": 512,
        "height": 512,
        "num_inference_steps": 20,
        "samples": num_samples,
        "key": api_key,
        "negative_prompt": "cars, people, humans, faces, buildings, text"
    }
    headers = {"Content-Type": "application/json"}

    try:
        # 1. Submit the generation job
        resp = requests.post(GENERATE_URL, headers=headers, json=payload, timeout=20)
        if resp.status_code != 200:
            return [FALLBACK_IMAGE] * num_samples

        data = resp.json()

        # 2. Check for direct (synchronous) output
        for key in ["output", "data", "images"]:
            if key in data:
                imgs = data[key]
                if isinstance(imgs, str):
                    return [imgs]
                if isinstance(imgs, list) and len(imgs) > 0:
                    return imgs[:num_samples]

        # 3. Async mode – get the fetch URL
        fetch_url = data.get("fetch_result")
        if not fetch_url:
            fetch_id = data.get("id")
            if not fetch_id:
                return [FALLBACK_IMAGE] * num_samples
            fetch_url = f"https://modelslab.com/api/v8/images/fetch/{fetch_id}"

        # 4. Poll until the image is ready (or timeout)
        start_time = time.time()
        while time.time() - start_time < MAX_POLL_TIME:
            time.sleep(POLL_INTERVAL)
            try:
                poll_resp = requests.post(
                    fetch_url,
                    headers=headers,
                    json={"key": api_key},
                    timeout=10
                )
                if poll_resp.status_code != 200:
                    continue

                poll_data = poll_resp.json()
                status = (poll_data.get("status") or "").lower()

                if status == "success":
                    imgs = poll_data.get("output") or poll_data.get("data") or []
                    if isinstance(imgs, str):
                        return [imgs]
                    if isinstance(imgs, list) and len(imgs) > 0:
                        return imgs[:num_samples]
                    return [FALLBACK_IMAGE] * num_samples

                elif status in ("processing", "queued", "pending"):
                    continue
                else:
                    # Unknown status – keep waiting
                    continue

            except Exception:
                continue

    except Exception:
        pass

    # Everything failed → fallback
    return [FALLBACK_IMAGE] * num_samples


def generate_planet_image(prompt):
    imgs = generate_planet_images(prompt, 1)
    return imgs[0] if imgs else FALLBACK_IMAGE


def extract_style_signature(image_url):
    return [random.random() for _ in range(10)]
