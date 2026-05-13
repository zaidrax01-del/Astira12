from flask import Flask
from flask_cors import CORS
from config import Config
from models import db, User, Planet
import uuid

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_system_planets()          # Always ensures the 15 originals exist

    from routes.auth import auth_bp
    from routes.planet import planet_bp
    from routes.compass import compass_bp
    from routes.fusion import fusion_bp
    from routes.governance import governance_bp
    from routes.rewards import rewards_bp
    from routes.help import help_bp
    from routes.payment import payment_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(planet_bp, url_prefix='/api/v1/planet')
    app.register_blueprint(compass_bp, url_prefix='/api/v1/compass')
    app.register_blueprint(fusion_bp, url_prefix='/api/v1/fusion')
    app.register_blueprint(governance_bp, url_prefix='/api/v1/governance')
    app.register_blueprint(rewards_bp, url_prefix='/api/v1/rewards')
    app.register_blueprint(help_bp, url_prefix='/api/v1/help')
    app.register_blueprint(payment_bp, url_prefix='/api/v1/payment')

    @app.route('/api/v1/health')
    def health():
        return {'status': 'ok'}

    # ---------- TEMPORARY safe cleanup endpoint ----------
    @app.route('/api/v1/admin/clean-non-system')
    def clean_non_system():
        """Delete all planets NOT created by the system seed account."""
        system_user = User.query.filter_by(wallet_address="0xAstiraSeed").first()
        if not system_user:
            return {'error': 'System user not found'}, 500
        Planet.query.filter(Planet.creator_id != system_user.id).delete()
        db.session.commit()
        # Re-seed to make sure the 15 are present (they won't duplicate)
        seed_system_planets()
        return {'status': 'All non-system planets removed. 15 system planets remain.'}
    # ------------------------------------------------------

    return app

def seed_system_planets():
    """Ensure the 15 official system planets always exist."""
    system_user = User.query.filter_by(wallet_address="0xAstiraSeed").first()
    if not system_user:
        system_user = User(
            wallet_address="0xAstiraSeed",
            nonce="genesis-seed",
            verification_status="full",
            free_generations_used=999
        )
        db.session.add(system_user)
        db.session.commit()

    ORIGINAL_PLANETS = [
        {
            "name": "Ignarion",
            "planet_type": "Fire Planet",
            "rarity": "Rare",
            "description": "A blazing world covered in molten oceans and erupting volcanoes. Ignarion radiates intense heat and is known for its unstable surface and fiery storms.",
            "image_url": "https://i.ibb.co/Wpprv92S/file-0000000082f4720a8e324b704b7fa33f.png"
        },
        {
            "name": "Verdyra",
            "planet_type": "Nature Planet",
            "rarity": "Uncommon",
            "description": "A vibrant world filled with endless forests, glowing vegetation, and rich ecosystems. Verdyra is known for its life energy and rare natural resources.",
            "image_url": "https://i.ibb.co/hJbKCP0V/file-00000000271c7243adbdab4bb0fd7198.png"
        },
        {
            "name": "Cryonix",
            "planet_type": "Ice Planet",
            "rarity": "Rare",
            "description": "A frozen world of endless glaciers and crystal storms. Cryonix shines with icy blue light, and beneath its surface lie ancient frozen secrets.",
            "image_url": "https://i.postimg.cc/GhYfK1Wz/file-0000000096fc71f4986f98d20fa2f655.png"
        },
        {
            "name": "Solvaris",
            "planet_type": "Solar Planet",
            "rarity": "Epic",
            "description": "A radiant golden world bathed in eternal sunlight. Solvaris emits warm, life-giving energy and is revered as a cosmic beacon of stability.",
            "image_url": "https://i.postimg.cc/m2TpXVcZ/file-00000000c8347243b313707c839a3e4d.png"
        },
        {
            "name": "Terranova",
            "planet_type": "Earth-like Planet",
            "rarity": "Common",
            "description": "A balanced and habitable world with oceans, forests, and stable climates. Terranova is ideal for life and often considered the foundation for new civilizations.",
            "image_url": "https://i.postimg.cc/NFCXxg9s/file-0000000088e071f4a38b674b96724918.png"
        },
        {
            "name": "Pyronox",
            "planet_type": "Volcanic Planet",
            "rarity": "Rare",
            "description": "A dark and unstable world dominated by active volcanoes and flowing magma rivers. Pyronox is constantly shifting, with violent eruptions reshaping its surface.",
            "image_url": "https://i.postimg.cc/9XsZzfh1/file-00000000c45471f4b1804b339a61a154.png"
        },
        {
            "name": "Gravion",
            "planet_type": "Rocky Planet",
            "rarity": "Common",
            "description": "A dense, heavy world with powerful gravity and rugged terrain. Gravion is rich in minerals and known for its massive mountains and deep canyons.",
            "image_url": "https://i.postimg.cc/s28DKvw1/file-00000000311071f4b675afc6b6c59f5d.png"
        },
        {
            "name": "Aqualis Prime",
            "planet_type": "Water Planet",
            "rarity": "Rare",
            "description": "A vast ocean world where deep blue waters cover nearly the entire surface. Massive tides and hidden depths make Aqualis Prime both beautiful and mysterious.",
            "image_url": "https://i.postimg.cc/13fkBMTz/file-00000000bf4471f494e465dcce23961b.png"
        },
        {
            "name": "Heliora",
            "planet_type": "Energy Planet",
            "rarity": "Epic",
            "description": "A radiant world powered by pure energy. Heliora glows intensely, with streams of light flowing across its surface, making it a source of immense power and mystery.",
            "image_url": "https://i.postimg.cc/T1NkWvTN/file-000000007cbc72469880782e40456670.png"
        },
        {
            "name": "Ignis Rex",
            "planet_type": "Ringed Fire Planet",
            "rarity": "Epic",
            "description": "A dominant volcanic world surrounded by a blazing ring of debris and molten fragments. Ignis Rex is both majestic and destructive, symbolizing raw cosmic power.",
            "image_url": "https://i.postimg.cc/g0pKj2vz/file-00000000c70871f4be9c05b82f4421c5.png"
        },
        {
            "name": "Drakonis",
            "planet_type": "Molten Core Planet",
            "rarity": "Epic",
            "description": "A fierce, fractured world with glowing magma veins running across its surface. Drakonis is known for its aggressive energy and constant internal eruptions.",
            "image_url": "https://i.postimg.cc/Y9HngxYx/file-00000000ed7c720a8d3af0568fb515cc.png"
        },
        {
            "name": "Voltaris",
            "planet_type": "Storm/Electric Planet",
            "rarity": "Epic",
            "description": "A chaotic world surrounded by constant lightning storms and charged clouds. Voltaris pulses with electric energy, making it both unstable and incredibly powerful.",
            "image_url": "https://i.postimg.cc/zv3nRLt5/file-00000000e4c0720aa0fc22d47e152f15.png"
        },
        {
            "name": "Nebulon",
            "planet_type": "Nebula Planet",
            "rarity": "Legendary",
            "description": "A mysterious world shrouded in shifting cosmic clouds and stardust. Nebulon's atmosphere constantly changes colours, hiding unknown secrets within.",
            "image_url": "https://i.postimg.cc/rzXKFzvK/file-00000000a12c7246bbf2eba55df79b6a.png"
        },
        {
            "name": "Gaialux",
            "planet_type": "Luminous Earth Planet",
            "rarity": "Epic",
            "description": "A vibrant, glowing terrestrial world where nature and light harmonise. Gaialux is famous for its bioluminescent forests and gentle, radiant energy.",
            "image_url": "https://i.postimg.cc/ZKSNSMZJ/file-00000000bf047243a9c13e188e2fd9c9.png"
        },
        {
            "name": "Cindros",
            "planet_type": "Burning Core Planet",
            "rarity": "Legendary",
            "description": "A volatile world with an exposed, blazing core visible from the surface. Cindros radiates intense heat and is known for sudden energy surges that can reshape its structure.",
            "image_url": "https://i.postimg.cc/h4rDXyTD/file-000000009f24720a8457f4d129b860b4.png"
        }
    ]

    for p_data in ORIGINAL_PLANETS:
        existing = Planet.query.filter_by(name=p_data['name'], is_deleted=False).first()
        if not existing:
            planet = Planet(
                creator_id=system_user.id,
                name=p_data['name'],
                description=p_data['description'],
                image_ipfs_hash=p_data['image_url'],
                style_signature=[],
                rarity=p_data['rarity'],
                planet_type=p_data['planet_type'],
                generation_number=1
            )
            db.session.add(planet)
    db.session.commit()
    print("✅ 15 system planets verified / inserted.")


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
