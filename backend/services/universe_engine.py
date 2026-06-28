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

# Style modifiers for AI prompt
STYLE_MODIFIERS = {
    "Cosmic": "deep space, nebula background, cosmic dust, astrophotography",
    "Sci-Fi": "futuristic, neon lights, cyberpunk elements, holographic atmosphere",
    "Fantasy": "magical, mythical, glowing runes, enchanted atmosphere, ancient magic",
    "Ancient": "ruins, ancient civilization, stone formations, mystical artifacts, old world",
    "Realistic": "photorealistic, NASA style, hyperrealistic, natural lighting, true colors",
    "Cinematic": "dramatic lighting, movie quality, epic composition, atmospheric haze, 8K"
}

# Creativity modifiers
CREATIVITY_MODIFIERS = {
    "Strict": "strictly follow the description, no extra elements, exactly as described",
    "Balanced": "use the description as inspiration, add some cosmic variety",
    "Creative": "take inspiration from the description, be wildly creative and unexpected"
}

# Keyword → (type, surface, atmosphere, dominant_color)
KEYWORD_MAP = {
    "fire": ("Lava World", "Molten", "Sulphuric Clouds", "Crimson"),
    "lava": ("Lava World", "Molten", "Sulphuric Clouds", "Crimson"),
    "volcano": ("Lava World", "Molten", "Volcanic Ash", "Crimson"),
    "ice": ("Ice Giant", "Icy", "Subzero Aurora Winds", "Sapphire"),
    "frozen": ("Ice Giant", "Icy", "Cryogenic Tempest", "Cyan"),
    "snow": ("Ice Giant", "Icy", "Cryogenic Tempest", "Cyan"),
    "water": ("Water World", "Oceanic", "Steam", "Cyan"),
    "ocean": ("Water World", "Oceanic", "Steam", "Cyan"),
    "sea": ("Water World", "Oceanic", "Steam", "Cyan"),
    "desert": ("Carbon World", "Dusty", "Golden Dust Storms", "Amber"),
    "sand": ("Carbon World", "Dusty", "Golden Dust Storms", "Amber"),
    "dune": ("Carbon World", "Dusty", "Golden Dust Storms", "Amber"),
    "forest": ("Terrestrial", "Jungle", "Oxygen-Rich", "Emerald"),
    "jungle": ("Terrestrial", "Jungle", "Oxygen-Rich", "Emerald"),
    "green": ("Terrestrial", "Jungle", "Oxygen-Rich", "Emerald"),
    "crystal": ("Crystal Sphere", "Crystal", "Ionized Plasma", "Violet"),
    "gem": ("Crystal Sphere", "Crystal", "Ionized Plasma", "Violet"),
    "diamond": ("Crystal Sphere", "Crystal", "Ionized Plasma", "Violet"),
    "dark": ("Rogue Planet", "Rocky", "None", "Violet"),
    "shadow": ("Rogue Planet", "Rocky", "None", "Violet"),
    "lightning": ("Iron Planet", "Metallic", "Ionized Plasma", "Purple"),
    "storm": ("Iron Planet", "Metallic", "Ionized Plasma", "Purple"),
    "gas": ("Gas Dwarf", "Metallic", "Methane Haze", "Amber"),
    "ring": (None, None, None, None),
}

def _seed_from_prompt(prompt: str) -> str:
    base = prompt + str(datetime.datetime.utcnow().timestamp())
    return hashlib.sha256(base.encode()).hexdigest()[:16]

def discover_planet(prompt: str, art_style: str = "Cosmic", creativity: str = "Balanced"):
    api_key = current_app.config.get('MODELS_LAB_API_KEY')
    if not api_key:
        return None

    seed = _seed_from_prompt(prompt)
    rng = random.Random(seed)

    # Detect keywords from the user's prompt
    lower = prompt.lower()
    detected_type = None
    detected_surface = None
    detected_atmosphere = None
    detected_color = None
    wants_rings = False

    for keyword, (ptype, psurface, patmosphere, pcolor) in KEYWORD_MAP.items():
        if keyword in lower:
            if ptype is not None:
                detected_type = ptype
                detected_surface = psurface
                detected_atmosphere = patmosphere
                detected_color = pcolor
            elif keyword == "ring":
                wants_rings = True
            break

    size_class = rng.choice(SIZE_CLASSES)
    size_factors = {
        "Tiny": (0.1, 0.3), "Small": (0.3, 0.6), "Medium": (0.6, 1.2),
        "Large": (1.2, 2.0), "Massive": (2.0, 3.0), "Titan": (3.0, 4.5),
        "Colossal": (4.5, 6.5)
    }
    grav_range = size_factors.get(size_class, (0.5, 1.5))
    temp_range = (-200 + (grav_range[0] * 30), 100 + (grav_range[1] * 60))

    planet = {
        "seed": seed,
        "dna": seed.upper()[:12],
        "name": rng.choice(NAMES) + " " + str(rng.randint(1, 999)),
        "type": detected_type or rng.choice(["Terrestrial", "Oceanic", "Ice Giant", "Lava World", "Crystal Sphere", "Gas Dwarf", "Rogue Planet", "Carbon World", "Iron Planet", "Water World"]),
        "surface": detected_surface or rng.choice(["Rocky", "Icy", "Molten", "Crystal", "Metallic", "Dusty", "Oceanic", "Jungle"]),
        "atmosphere": detected_atmosphere or rng.choice(["Dense Nitrogen", "Thin Helium", "Oxygen-Rich", "Methane Haze", "Sulphuric Clouds", "None", "Ionized Plasma", "Steam"]),
        "dominant_color": detected_color or rng.choice(["Violet", "Cyan", "Crimson", "Emerald", "Amber", "Sapphire"]),
        "star_system": rng.choice(["Red Dwarf", "Blue Giant", "Binary Stars", "White Dwarf", "Neutron Star", "Pulsar", "Yellow Main Sequence"]),
        "gravity": f"{rng.uniform(grav_range[0], grav_range[1]):.1f}g",
        "temperature": f"{rng.randint(int(temp_range[0]), int(temp_range[1]))}°C",
        "moons": rng.randint(0, 12),
        "rings": "Luminous Rings" if wants_rings else rng.choice(["None", "Faint Ice Rings", "Dense Dust Rings", "Luminous Rings"]),
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

    planet["value_index"] = round(
        (rng.uniform(0.1, 1.0) +
         (0.2 if planet["civilization_potential"] in ["Moderate", "High"] else 0) +
         (0.15 if planet["moons"] > 3 else 0) +
         (0.1 if planet["rings"] != "None" else 0) +
         (0.1 if planet["energy_signature"] in ["High", "Anomalous"] else 0)) * 50, 1
    )

    # Build the AI prompt – user description first, then style, creativity, NFT quality
    style_modifier = STYLE_MODIFIERS.get(art_style, STYLE_MODIFIERS["Cosmic"])
    creativity_modifier = CREATIVITY_MODIFIERS.get(creativity, CREATIVITY_MODIFIERS["Balanced"])

    ai_prompt = (
        f"NFT-quality digital art of a planet: {prompt}. "
        f"{creativity_modifier}. "
        f"A {planet['size_class'].lower()} {planet['type'].lower()} with {planet['surface'].lower()} surface, "
        f"{planet['atmosphere']} atmosphere, "
        f"dominant color {planet['dominant_color'].lower()}, "
        f"orbiting a {planet['star_system']}, "
        f"with {planet['moons']} moons, {planet['rings'].lower()}. "
        f"{style_modifier}. "
        f"Suitable for NFT minting, collectible digital asset, clean background, no text, no watermarks."
    )

    images = generate_planet_images(ai_prompt, 1)
    if images and len(images) > 0:
        planet["image_url"] = images[0]
    else:
        planet["image_url"] = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

    planet["style_signature"] = extract_style_signature(planet["image_url"])
    return planet
