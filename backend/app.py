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
        seed_system_planets()          # Always ensures the 8 originals exist

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
        # Re-seed to make sure the 8 are present (they won't duplicate)
        seed_system_planets()
        return {'status': 'All non-system planets removed. 8 system planets remain.'}
    # ------------------------------------------------------

    return app

def seed_system_planets():
    """Ensure the 8 official system planets always exist."""
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
            "name": "Aurum Prime",
            "planet_type": "Gold Planet",
            "rarity": "SSS",
            "description": "The capital realm of the Eight Worlds, built from living gold and powered by ancient stellar cores. Entire cities float above the surface, and massive golden rings orbit the planet.",
            "image_url": "/aurum-prime.png"
        },
        {
            "name": "Verdantia",
            "planet_type": "Wood Planet",
            "rarity": "SS",
            "description": "A living world evolved through a fusion of ancient nature and bio-technology. Massive world trees stretch across continents, and the atmosphere itself heals living organisms.",
            "image_url": "/verdantia.png"
        },
        {
            "name": "Thalassaris",
            "planet_type": "Water Planet",
            "rarity": "SSS",
            "description": "The infinite ocean realm of the Eight Worlds, covered by luminous celestial waters. Floating kingdoms drift endlessly, and its waters store memories of past civilizations.",
            "image_url": "/thalassaris.png"
        },
        {
            "name": "Ignis Vex",
            "planet_type": "Fire Planet",
            "rarity": "SSS",
            "description": "A volcanic world where strength and evolution are forged through fire. It is the source of all power, rebirth, and conquest in the galaxy.",
            "image_url": "/ignis-vex.png"
        },
        {
            "name": "Terranova Prime",
            "planet_type": "Earth Planet",
            "rarity": "SSS",
            "description": "The backbone of civilization, holding the galaxy's greatest resources. It represents legacy, stability, and the foundation of the Eight Worlds.",
            "image_url": "/terranova-prime.png"
        },
        {
            "name": "Cryonis Eternal",
            "planet_type": "Ice Planet",
            "rarity": "SSS",
            "description": "The keeper of ancient knowledge and forgotten history, preserving time itself in a frozen embrace. It represents discipline and eternity.",
            "image_url": "/cryonis-eternal.png"
        },
        {
            "name": "Voltaris Nexus",
            "planet_type": "Lightning Planet",
            "rarity": "SSS",
            "description": "The fastest and most technologically advanced energy producer, with planet-wide lightning storms and floating energy towers.",
            "image_url": "/voltaris-nexus.png"
        },
        {
            "name": "Cyberion Prime",
            "planet_type": "Cyber Planet",
            "rarity": "SSS+",
            "description": "The most advanced world ever created, governed by a planetary superintelligence. Endless neon megacities and AI-controlled infrastructure define its surface.",
            "image_url": "/cyberion-prime.png"
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
    print("✅ 8 system planets verified / inserted.")


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
