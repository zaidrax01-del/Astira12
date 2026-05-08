from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.ai_service import generate_planet_image, extract_style_signature
from services.lineage_service import check_derivative
from services.token_service import deduct_ast, add_transaction
from services.security import check_cooldown, check_abuse
from utils.ipfs import upload_to_ipfs

planet_bp = Blueprint('planet', __name__)

@planet_bp.route('/generate', methods=['POST'])
def generate():
    user_id = request.headers.get('X-User-Id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

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
    else:
        cost = 50  # AST
        if not deduct_ast(user, cost):
            return jsonify({'error': 'Insufficient AST balance'}), 402

    image_data = generate_planet_image(prompt)
    if not image_data:
        if cost > 0:
            add_transaction(user, 'refund', cost, 'failed_gen')
        return jsonify({'error': 'AI generation failed'}), 500

    ipfs_hash = upload_to_ipfs(image_data)
    style_sig = extract_style_signature(image_data)

    derivative_root, similarity = check_derivative(style_sig)
    planet = Planet(
        creator_id=user.id,
        name=f"Planet #{Planet.query.count()+1}",
        image_ipfs_hash=ipfs_hash,
        style_signature=style_sig,
        rarity='common',
        planet_type='terrestrial',
        generation_number=1,
        derivative_root_id=derivative_root
    )
    db.session.add(planet)
    db.session.commit()

    if cost > 0:
        add_transaction(user, 'mint', -cost, 'planet_generation')

    if derivative_root:
        from services.reward_engine import create_reward_pool
        create_reward_pool(planet.id, cost)

    return jsonify({
        'planet_id': str(planet.id),
        'image_url': f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}",
        'derivative': bool(derivative_root)
    })
