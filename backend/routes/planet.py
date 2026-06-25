from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.universe_engine import discover_planet    # <-- new engine
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
import uuid

planet_bp = Blueprint('planet', __name__)

# ---------- GENERATE endpoint ----------
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
            free_generations_used=0
        )
        db.session.add(user)
        db.session.commit()

    if check_abuse(user):
        return jsonify({'error': 'Suspicious activity detected.'}), 403
    if not check_cooldown(user):
        return jsonify({'error': 'Cooldown active. Try again later.'}), 429

    data = request.get_json()
    prompt = data.get('prompt', '')
    num_samples = data.get('num_samples', 5)

    # Check generation eligibility
    if user.free_generations_used < 3:
        user.free_generations_used += 1
        db.session.commit()
        cost = 0
    elif user.has_premium_generation:
        cost = 0
    else:
        return jsonify({'error': 'premium_required', 'message': 'Please unlock Advanced AI Generation ($7.99 one-time) to continue.'}), 402

    # Discovery via universe engine – returns a list of complete planet dictionaries
    planets = discover_planet(prompt, num_samples)
    if not planets or len(planets) == 0:
        return jsonify({'error': 'Discovery failed'}), 500

    # Convert to a frontend-friendly format
    results = []
    for p in planets:
        results.append({
            "image_url": p["image_url"],
            "style_signature": p["style_signature"],
            "name": p["name"],
            "dna": p["dna"],
            "seed": p["seed"],
            "type": p["type"],
            "atmosphere": p["atmosphere"],
            "surface": p["surface"],
            "gravity": p["gravity"],
            "temperature": p["temperature"],
            "moons": p["moons"],
            "rings": p["rings"],
            "star_system": p["star_system"],
            "dominant_color": p["dominant_color"],
            "civilization_potential": p["civilization_potential"],
            "energy_signature": p["energy_signature"],
            "rarity": p["rarity"],
        })

    return jsonify({'variations': results})


# ---------- SAVE endpoint (unchanged) ----------
@planet_bp.route('/save', methods=['POST'])
def save_planet():
    """Saves the planet with a name and description provided by the user."""
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

    # Check derivative lineage
    derivative_root, similarity = check_derivative(style_sig) if style_sig else (None, 0)

    planet = Planet(
        creator_id=user.id,
        name=name,
        description=description,
        image_ipfs_hash=image_url,          # store the direct URL
        style_signature=style_sig,
        rarity='common',                    # will be updated from metadata if needed
        planet_type='terrestrial',          # placeholder
        generation_number=1,
        derivative_root_id=derivative_root
    )
    db.session.add(planet)
    db.session.commit()

    if derivative_root:
        from services.reward_engine import create_reward_pool
        create_reward_pool(planet.id, 0)   # cost was already handled during generation

    return jsonify({
        'planet_id': str(planet.id),
        'name': name,
        'image_url': image_url,
        'message': 'Planet saved successfully!'
    })
