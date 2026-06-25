import hashlib
import random
import datetime
from services.ai_service import generate_planet_images, extract_style_signature

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
    base = prompt + str(datetime.datetime.utcnow().timestamp())
    return hashlib.sha256(base.encode()).hexdigest()[:16]

def discover_planet(prompt: str):
    """Discover a single planet based on the user's prompt."""
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return None

    seed = _seed_from_prompt(prompt)
    rng = random.Random(seed)

    # 1. Build metadata
    planet = {
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

    # 2. Craft the AI prompt
    ai_prompt = (
        f"cinematic 4K space art of a planet named {planet['name']}, "
        f"a {planet['type']} with {planet['surface'].lower()} surface, "
        f"{planet['atmosphere']} atmosphere, "
        f"gravity {planet['gravity']}, "
        f"orbiting a {planet['star_system']}, "
        f"with {planet['moons']} moons, {planet['rings'].lower()}, "
        f"dominant color {planet['dominant_color'].lower()}, "
        f"astro photography, hyperrealistic, NASA style"
    )

    # 3. Generate one image
    image_urls = generate_planet_images(ai_prompt, 1)
    if image_urls and len(image_urls) > 0:
        planet["image_url"] = image_urls[0]
    else:
        # fallback only if API call completely fails (should not happen)
        planet["image_url"] = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

    planet["style_signature"] = extract_style_signature(planet["image_url"])
    return planet
