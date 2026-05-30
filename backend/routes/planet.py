# backend/routes/planet.py
from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.ai_service import generate_planet_images, extract_style_signature
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
import uuid

planet_bp = Blueprint('planet', __name__)

# No fallback image – if generation fails we return an error

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

    # Generate multiple planet images – returns a list of URLs or None
    images = generate_planet_images(prompt, num_samples)
    if not images or len(images) == 0:
        return jsonify({'error': 'AI generation failed'}), 500

    # For each image, extract a style signature
    results = []
    for img_url in images:
        style_sig = extract_style_signature(img_url)
        results.append({
            'image_url': img_url,
            'style_signature': style_sig
        })

    return jsonify({'variations': results})


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
        rarity='common',
        planet_type='terrestrial',
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
