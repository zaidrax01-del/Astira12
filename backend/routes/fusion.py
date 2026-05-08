from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.fusion_engine import fuse_planets
from services.token_service import deduct_ast, add_transaction

fusion_bp = Blueprint('fusion', __name__)

@fusion_bp.route('/preview', methods=['POST'])
def preview_fusion():
    data = request.get_json()
    ids = data.get('planet_ids')
    if len(ids) != 2:
        return jsonify({'error': 'Exactly two planets required'}), 400
    planet1 = Planet.query.get(ids[0])
    planet2 = Planet.query.get(ids[1])
    if not planet1 or not planet2:
        return jsonify({'error': 'Planet not found'}), 404
    # Simplified preview
    cost = 120  # AST
    return jsonify({
        'compatibility': 0.85,
        'estimated_rarity': 'rare',
        'cost': cost
    })

@fusion_bp.route('/execute', methods=['POST'])
def execute_fusion():
    user_id = request.headers.get('X-User-Id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    ids = data.get('planet_ids')
    planet1 = Planet.query.get(ids[0])
    planet2 = Planet.query.get(ids[1])
    if not planet1 or not planet2:
        return jsonify({'error': 'Planet not found'}), 404

    cost = 120
    if not deduct_ast(user, cost):
        return jsonify({'error': 'Insufficient AST balance'}), 402

    new_planet_data = fuse_planets(planet1, planet2)
    if not new_planet_data:
        add_transaction(user, 'refund', cost, 'failed_fusion')
        return jsonify({'error': 'Fusion failed'}), 500

    new_planet = Planet(
        creator_id=user.id,
        name=new_planet_data['name'],
        image_ipfs_hash=new_planet_data['image_ipfs_hash'],
        style_signature=new_planet_data['style_signature'],
        rarity=new_planet_data['rarity'],
        planet_type=new_planet_data['planet_type'],
        parent_ids=[planet1.id, planet2.id],
        generation_number=max(planet1.generation_number, planet2.generation_number) + 1
    )
    db.session.add(new_planet)
    db.session.commit()
    add_transaction(user, 'fusion', -cost, 'planet_fusion')

    return jsonify({
        'planet_id': str(new_planet.id),
        'image_url': new_planet.image_ipfs_hash
    })
