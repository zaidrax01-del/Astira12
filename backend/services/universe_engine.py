import hashlib
import random
import datetime
from flask import current_app
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
SIZE_CLASSES = ["Tiny", "Small", "Medium", "Large", "Massive", "Titan", "Colossal"]
EVENTS_POOL = [
    "Crystal Storms", "Meteor Showers", "Solar Eclipse", "Aurora Activity",
    "Magnetic Disturbance", "Acid Rain", "Frozen Winds", "Volcanic Activity",
    "Radioactive Zones", "Calm Conditions"
]
RARE_DISCOVERIES = [
    "Ancient Civilization Detected", "Unknown Transmission Received",
    "Alien Ruins Found", "Living Planet", "Temporal Distortion",
    "Planet Missing From Galactic Database", "Ancient Megastructure Detected",
    "Unknown Energy Source"
]

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

    size_class = rng.choice(SIZE_CLASSES)

    # Gravity range based on size
    size_factors = {
        "Tiny": (0.1, 0.3), "Small": (0.3, 0.6), "Medium": (0.6, 1.2),
        "Large": (1.2, 2.0), "Massive": (2.0, 3.0), "Titan": (3.0, 4.5),
        "Colossal": (4.5, 6.5)
    }
    grav_range = size_factors.get(size_class, (0.5, 1.5))
    temp_range = (-200 + (grav_range[0] * 30), 100 + (grav_range[1] * 60))

    # Build the planet dictionary FIRST (without value_index)
    planet = {
        "seed": seed,
        "dna": seed.upper()[:12],
        "name": rng.choice(NAMES) + " " + str(rng.randint(1, 999)),
        "type": rng.choice(TYPES),
        "atmosphere": rng.choice(ATMOSPHERES),
        "surface": rng.choice(SURFACES),
        "star_system": rng.choice(STAR_TYPES),
        "gravity": f"{rng.uniform(grav_range[0], grav_range[1]):.1f}g",
        "temperature": f"{rng.randint(int(temp_range[0]), int(temp_range[1]))}°C",
        "moons": rng.randint(0, 12),
        "rings": rng.choice(["None", "Faint Ice Rings", "Dense Dust Rings", "Luminous Rings"]),
        "dominant_color": rng.choice(["Violet", "Cyan", "Crimson", "Emerald", "Amber", "Sapphire"]),
        "civilization_potential": rng.choice(["None", "Low", "Moderate", "High"]),
        "energy_signature": rng.choice(["Low", "Normal", "High", "Anomalous"]),
        "rarity": rng.choice(RARITIES),
        "coord_x": rng.randint(-8000, 8000),
        "coord_y": rng.randint(-8000, 8000),
        "coord_z": rng.randint(-8000, 8000),
        "size_class": size_class,
        "events": ", ".join(rng.sample(EVENTS_POOL, rng.randint(0, 3))) if rng.randint(0, 1) else "",
        "rare_discovery": rng.choice(RARE_DISCOVERIES) if rng.randint(1, 100) <= 2 else None,
    }

    # NOW calculate value_index (planet dict is fully built)
    planet["value_index"] = round(
        (rng.uniform(0.1, 1.0) +
         (0.2 if planet["civilization_potential"] in ["Moderate", "High"] else 0) +
         (0.15 if planet["moons"] > 3 else 0) +
         (0.1 if planet["rings"] != "None" else 0) +
         (0.1 if planet["energy_signature"] in ["High", "Anomalous"] else 0)) * 50, 1
    )

    # Craft the AI prompt
    ai_prompt = (
        f"cinematic 4K space art of a {size_class.lower()} planet named {planet['name']}, "
        f"a {planet['type']} with {planet['surface'].lower()} surface, "
        f"{planet['atmosphere']} atmosphere, "
        f"gravity {planet['gravity']}, "
        f"orbiting a {planet['star_system']}, "
        f"with {planet['moons']} moons, {planet['rings'].lower()}, "
        f"dominant color {planet['dominant_color'].lower()}, "
        f"astro photography, hyperrealistic, NASA style"
    )

    # Generate the image
    images = generate_planet_images(ai_prompt, 1)
    if images and len(images) > 0:
        planet["image_url"] = images[0]
    else:
        planet["image_url"] = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

    planet["style_signature"] = extract_style_signature(planet["image_url"])
    return planet
