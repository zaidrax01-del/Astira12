from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.ai_service import generate_planet_image, extract_style_signature
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
import uuid

planet_bp = Blueprint('planet', __name__)

FALLBACK_IMAGE = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

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

    if user.free_generations_used < 3:
        user.free_generations_used += 1
        db.session.commit()
        cost = 0
    elif user.has_premium_generation:
        cost = 0
    else:
        return jsonify({'error': 'premium_required', 'message': 'Please unlock Advanced AI Generation ($7.99 one-time) to continue.'}), 402

    # Generates a direct image URL (or None)
    image_url = generate_planet_image(prompt)
    if not image_url:
        image_url = FALLBACK_IMAGE

    # Style signature from the image URL (mock for now)
    style_sig = extract_style_signature(image_url) if image_url else []

    derivative_root, similarity = check_derivative(style_sig) if style_sig else (None, 0)

    planet = Planet(
        creator_id=user.id,
        name=f"Planet #{Planet.query.count()+1}",
        image_ipfs_hash=image_url,          # store the direct URL here
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
        create_reward_pool(planet.id, cost)

    return jsonify({
        'planet_id': str(planet.id),
        'image_url': image_url,             # direct URL
        'derivative': bool(derivative_root)
    })
