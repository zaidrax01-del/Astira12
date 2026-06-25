from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.universe_engine import discover_planet
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
import uuid

planet_bp = Blueprint('planet', __name__)

@planet_bp.route('/generate', methods=['POST'])
def generate():
    wallet_address = request.headers.get('X-User-Id')
    if not wallet_address:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        user = User(
            wallet_address=wallet_address,
            nonce=str(uuid.uuid4()),
            verification_status='none',
            free_discoveries_used=0,
            paid_discoveries_available=0
        )
        db.session.add(user)
        db.session.commit()

    if check_abuse(user):
        return jsonify({'error': 'Suspicious activity detected.'}), 403
    if not check_cooldown(user):
        return jsonify({'error': 'Cooldown active. Try again later.'}), 429

    data = request.get_json()
    prompt = data.get('prompt', '')

    # Discovery eligibility
    if user.free_discoveries_used < 3:
        user.free_discoveries_used += 1
        db.session.commit()
    elif user.paid_discoveries_available > 0:
        user.paid_discoveries_available -= 1
        db.session.commit()
    else:
        return jsonify({'error': 'payment_required', 'message': 'No free discoveries remaining. Unlock another expedition for 0.002 SOL.'}), 402

    # Discover ONE planet
    planet_data = discover_planet(prompt)
    if not planet_data:
        return jsonify({'error': 'Discovery failed'}), 500

    return jsonify({
        'planet': {
            "image_url": planet_data["image_url"],
            "style_signature": planet_data["style_signature"],
            "name": planet_data["name"],
            "dna": planet_data["dna"],
            "seed": planet_data["seed"],
            "type": planet_data["type"],
            "atmosphere": planet_data["atmosphere"],
            "surface": planet_data["surface"],
            "gravity": planet_data["gravity"],
            "temperature": planet_data["temperature"],
            "moons": planet_data["moons"],
            "rings": planet_data["rings"],
            "star_system": planet_data["star_system"],
            "dominant_color": planet_data["dominant_color"],
            "civilization_potential": planet_data["civilization_potential"],
            "energy_signature": planet_data["energy_signature"],
            "rarity": planet_data["rarity"],
        }
    })

@planet_bp.route('/save', methods=['POST'])
def save_planet():
    wallet_address = request.headers.get('X-User-Id')
    if not wallet_address:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    image_url = data.get('image_url')
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    style_sig = data.get('style_signature', [])

    if not image_url:
        return jsonify({'error': 'Missing image URL'}), 400
    if not name:
        return jsonify({'error': 'Planet name is required'}), 400

    derivative_root, similarity = check_derivative(style_sig) if style_sig else (None, 0)

    planet = Planet(
        creator_id=user.id,
        name=name,
        description=description,
        image_ipfs_hash=image_url,
        style_signature=style_sig,
        rarity='common',
        planet_type='terrestrial',
        generation_number=1,
        derivative_root_id=derivative_root
    )
    db.session.add(planet)
    db.session.commit()

    if derivative_root:
        from services.reward_engine import create_reward_pool
        create_reward_pool(planet.id, 0)

    return jsonify({
        'planet_id': str(planet.id),
        'name': name,
        'image_url': image_url,
        'message': 'Planet saved successfully!'
    })
