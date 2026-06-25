import hashlib
import random
import datetime
from services.ai_service import generate_planet_images, extract_style_signature

# Sample data pools for procedural generation
NAMES = [
    "Nyxara", "Aurion", "Vexoria", "Thalor", "Eldros", "Caelum", "Zenthia",
    "Solvara", "Mythros", "Lunarix", "Drakara", "Oceara", "Ignisar", "Cryonis",
    "Terralux", "Aerion", "Nebulix", "Pyronis", "Glaceria", "Verdanis"
]
TYPES = ["Terrestrial", "Oceanic", "Ice Giant", "Lava World", "Crystal Sphere",
         "Gas Dwarf", "Rogue Planet", "Carbon World", "Iron Planet", "Water World"]
ATMOSPHERES = ["Dense Nitrogen", "Thin Helium", "Oxygen-Rich", "Methane Haze",
               "Sulphuric Clouds", "None", "Ionized Plasma", "Steam"]
SURFACES = ["Rocky", "Icy", "Molten", "Crystal", "Metallic", "Dusty", "Oceanic", "Jungle"]
STAR_TYPES = ["Red Dwarf", "Blue Giant", "Binary Stars", "White Dwarf", "Neutron Star",
              "Pulsar", "Yellow Main Sequence"]
RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]

def _seed_from_prompt(prompt: str) -> str:
    """Create a deterministic seed based on prompt + current timestamp (ensures uniqueness per discovery)."""
    base = prompt + str(datetime.datetime.utcnow().timestamp())
    return hashlib.sha256(base.encode()).hexdigest()[:16]

def discover_planet(prompt: str, num_variations: int = 5):
    """
    Main discovery function.
    Returns a dict with a list of 'variations', each being a complete planet object.
    """
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return None

    # 1. Generate planet DNA and metadata for each variation
    planets = []
    for i in range(num_variations):
        seed = _seed_from_prompt(prompt + str(i))
        rng = random.Random(seed)
        planet_data = {
            "seed": seed,
            "dna": seed.upper()[:12],
            "name": rng.choice(NAMES) + " " + str(rng.randint(1, 999)),
            "type": rng.choice(TYPES),
            "atmosphere": rng.choice(ATMOSPHERES),
            "surface": rng.choice(SURFACES),
            "star_system": rng.choice(STAR_TYPES),
            "gravity": f"{rng.uniform(0.3, 3.0):.1f}g",
            "temperature": f"{rng.randint(-200, 500)}°C",
            "moons": rng.randint(0, 12),
            "rings": rng.choice(["None", "Faint Ice Rings", "Dense Dust Rings", "Luminous Rings"]),
            "dominant_color": rng.choice(["Violet", "Cyan", "Crimson", "Emerald", "Amber", "Sapphire"]),
            "civilization_potential": rng.choice(["None", "Low", "Moderate", "High"]),
            "energy_signature": rng.choice(["Low", "Normal", "High", "Anomalous"]),
            "rarity": rng.choice(RARITIES),
        }
        planets.append(planet_data)

    # 2. Build a detailed AI prompt for each planet
    ai_prompts = []
    for p in planets:
        # Craft an image prompt based on the metadata
        ai_prompt = (
            f"cinematic 4K space art of a planet named {p['name']}, "
            f"a {p['type']} with {p['surface'].lower()} surface, "
            f"{p['atmosphere']} atmosphere, "
            f"gravity {p['gravity']}, "
            f"orbiting a {p['star_system']}, "
            f"with {p['moons']} moons, {p['rings'].lower()}, "
            f"dominant color {p['dominant_color'].lower()}, "
            f"astro photography, hyperrealistic, NASA style"
        )
        ai_prompts.append(ai_prompt)

    # 3. Request all images in one call (if possible) or sequentially
    # ModelsLab supports multiple samples in one call, but we have different prompts.
    # We'll call generate_planet_images individually for each prompt to ensure a matching image.
    for i, p_data in enumerate(planets):
        img_urls = generate_planet_images(ai_prompts[i], num_samples=1)
        if img_urls and len(img_urls) > 0:
            p_data["image_url"] = img_urls[0]
        else:
            # Fallback: use a generic planet placeholder (but this shouldn't happen if API key is valid)
            p_data["image_url"] = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"
        # style signature for lineage (mock)
        p_data["style_signature"] = extract_style_signature(p_data["image_url"])

    return planets
