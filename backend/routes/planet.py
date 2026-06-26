from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.universe_engine import discover_planet
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
from sqlalchemy import func
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

    if user.free_discoveries_used < 3:
        user.free_discoveries_used += 1
        db.session.commit()
    elif user.paid_discoveries_available > 0:
        user.paid_discoveries_available -= 1
        db.session.commit()
    else:
        return jsonify({'error': 'payment_required', 'message': 'No free discoveries remaining.'}), 402

    planet_data = discover_planet(prompt)
    if not planet_data:
        return jsonify({'error': 'Discovery failed'}), 500

    # Assign next discovery number (max + 1)
    max_num = db.session.query(func.max(Planet.discovery_number)).scalar() or 0
    discovery_number = max_num + 1

    # Save planet to DB
    new_planet = Planet(
        creator_id=user.id,
        name=planet_data['name'],
        description='',  # filled later by user
        image_ipfs_hash=planet_data['image_url'],
        style_signature=planet_data['style_signature'],
        rarity=planet_data['rarity'],
        planet_type=planet_data['type'],
        generation_number=1,
        coord_x=planet_data['coord_x'],
        coord_y=planet_data['coord_y'],
        coord_z=planet_data['coord_z'],
        discovery_number=discovery_number,
        size_class=planet_data['size_class'],
        value_index=planet_data['value_index'],
        events=planet_data['events'],
        rare_discovery=planet_data['rare_discovery']
    )
    db.session.add(new_planet)
    db.session.commit()

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
            "coord_x": planet_data["coord_x"],
            "coord_y": planet_data["coord_y"],
            "coord_z": planet_data["coord_z"],
            "size_class": planet_data["size_class"],
            "value_index": planet_data["value_index"],
            "events": planet_data["events"],
            "rare_discovery": planet_data["rare_discovery"],
            "discovery_number": discovery_number,
        }
    })

# /save endpoint unchanged (as previously provided)
