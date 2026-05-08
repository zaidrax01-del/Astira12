import sys, os
sys.path.append(os.path.dirname(__file__))

from app import create_app
from models import db, Planet, User
import uuid

app = create_app()

PLANETS = [
    {"name": "Ignarion", "planet_type": "Fire Planet", "rarity": "Rare",
     "description": "A blazing world covered in molten oceans and erupting volcanoes...",
     "image_url": "https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png"},
    {"name": "Verdyra", "planet_type": "Nature Planet", "rarity": "Uncommon",
     "description": "A vibrant world filled with endless forests...",
     "image_url": "https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png"},
    {"name": "Cryonix", "planet_type": "Ice Planet", "rarity": "Rare",
     "description": "A frozen world of endless glaciers...",
     "image_url": "https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png"},
    {"name": "Solvaris", "planet_type": "Solar Planet", "rarity": "Epic",
     "description": "A radiant golden world...",
     "image_url": "https://i.postimg.cc/m2TpXVcZ/file-00000000c8347243b313707c839a3e4d.png"},
    {"name": "Terranova", "planet_type": "Earth-like Planet", "rarity": "Common",
     "description": "A balanced and habitable world...",
     "image_url": "https://i.postimg.cc/NFCXxg9s/file-0000000088e071f4a38b674b96724918.png"},
    {"name": "Pyronox", "planet_type": "Volcanic Planet", "rarity": "Rare",
     "description": "A dark and unstable world...",
     "image_url": "https://i.postimg.cc/9XsZzfh1/file-00000000c45471f4b1804b339a61a154.png"},
    {"name": "Gravion", "planet_type": "Rocky Planet", "rarity": "Common",
     "description": "A dense, heavy world...",
     "image_url": "https://i.postimg.cc/s28DKvw1/file-00000000311071f4b675afc6b6c59f5d.png"},
    {"name": "Aqualis Prime", "planet_type": "Water Planet", "rarity": "Rare",
     "description": "A vast ocean world...",
     "image_url": "https://i.postimg.cc/13fkBMTz/file-00000000bf4471f494e465dcce23961b.png"},
    {"name": "Heliora", "planet_type": "Energy Planet", "rarity": "Epic",
     "description": "A radiant world powered by pure energy...",
     "image_url": "https://i.postimg.cc/T1NkWvTN/file-000000007cbc72469880782e40456670.png"},
    {"name": "Ignis Rex", "planet_type": "Ringed Fire Planet", "rarity": "Epic",
     "description": "A dominant volcanic world...",
     "image_url": "https://i.postimg.cc/g0pKj2vz/file-00000000c70871f4be9c05b82f4421c5.png"},
    {"name": "Drakonis", "planet_type": "Molten Core Planet", "rarity": "Epic",
     "description": "A fierce, fractured world...",
     "image_url": "https://i.postimg.cc/Y9HngxYx/file-00000000ed7c720a8d3af0568fb515cc.png"},
    {"name": "Voltaris", "planet_type": "Storm/Electric Planet", "rarity": "Epic",
     "description": "A chaotic world surrounded by constant lightning...",
     "image_url": "https://i.postimg.cc/zv3nRLt5/file-00000000e4c0720aa0fc22d47e152f15.png"},
    {"name": "Nebulon", "planet_type": "Nebula Planet", "rarity": "Legendary",
     "description": "A mysterious world shrouded in shifting cosmic clouds...",
     "image_url": "https://i.postimg.cc/rzXKFzvK/file-00000000a12c7246bbf2eba55df79b6a.png"},
    {"name": "Gaialux", "planet_type": "Luminous Earth Planet", "rarity": "Epic",
     "description": "A vibrant, glowing terrestrial world...",
     "image_url": "https://i.postimg.cc/ZKSNSMZJ/file-00000000bf047243a9c13e188e2fd9c9.png"},
    {"name": "Cindros", "planet_type": "Burning Core Planet", "rarity": "Legendary",
     "description": "A volatile world with an exposed, blazing core...",
     "image_url": "https://i.postimg.cc/h4rDXyTD/file-000000009f24720a8457f4d129b860b4.png"}
]

def seed():
    with app.app_context():
        user = User.query.filter_by(wallet_address="0xAstiraSeed").first()
        if not user:
            user = User(wallet_address="0xAstiraSeed", nonce="seed", verification_status="full", free_generations_used=999)
            db.session.add(user)
            db.session.commit()
        for p in PLANETS:
            if not Planet.query.filter_by(name=p['name']).first():
                planet = Planet(
                    creator_id=user.id,
                    name=p['name'],
                    description=p['description'],
                    image_ipfs_hash=p['image_url'],
                    style_signature=[],
                    rarity=p['rarity'],
                    planet_type=p['planet_type'],
                    generation_number=1
                )
                db.session.add(planet)
        db.session.commit()
        print("✅ 15 planets seeded.")

if __name__ == '__main__':
    seed()
