# backend/services/fusion_engine.py
import random
from services.ai_service import generate_planet_images, extract_style_signature
from utils.ipfs import upload_to_ipfs

def fuse_planets(planet1, planet2):
    """Combine two planets into a new hybrid planet.
    Requests a single AI-generated image for the fusion.
    Returns a dict with planet data, or None if generation fails.
    """
    prompt = f"fusion of {planet1.name} ({planet1.planet_type}) and {planet2.name} ({planet2.planet_type})"
    images = generate_planet_images(prompt, num_samples=1)
    if not images or len(images) == 0:
        return None
    image_url = images[0]
    sig = extract_style_signature(image_url)
    rarity = 'rare' if (planet1.rarity == 'Rare' or planet2.rarity == 'Rare') else 'common'
    return {
        'name': f"Fused-{planet1.name[:3]}{planet2.name[:3]}",
        'image_ipfs_hash': image_url,   # stores the direct image URL
        'style_signature': sig,
        'rarity': rarity,
        'planet_type': 'hybrid'
    }
