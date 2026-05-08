import random
from services.ai_service import generate_planet_image, extract_style_signature
from utils.ipfs import upload_to_ipfs

def fuse_planets(planet1, planet2):
    # For demo, generate a new planet image with combined prompt
    prompt = f"fusion of {planet1.name} ({planet1.planet_type}) and {planet2.name} ({planet2.planet_type})"
    img_data = generate_planet_image(prompt)
    if not img_data:
        return None
    ipfs_hash = upload_to_ipfs(img_data)
    sig = extract_style_signature(img_data)
    rarity = 'rare' if (planet1.rarity == 'Rare' or planet2.rarity == 'Rare') else 'common'
    return {
        'name': f"Fused-{planet1.name[:3]}{planet2.name[:3]}",
        'image_ipfs_hash': ipfs_hash,
        'style_signature': sig,
        'rarity': rarity,
        'planet_type': 'hybrid'
    }
