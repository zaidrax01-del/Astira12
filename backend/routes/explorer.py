from flask import Blueprint, request, jsonify
from models import db, User, Planet

explorer_bp = Blueprint('explorer', __name__)

@explorer_bp.route('/discoveries', methods=['GET'])
def explorer_discoveries():
    wallet = request.headers.get('X-User-Id')
    if not wallet:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.filter_by(wallet_address=wallet).first()
    if not user:
        return jsonify({'error': 'Explorer not found'}), 404

    planets = Planet.query.filter_by(creator_id=user.id, is_deleted=False).all()
    results = [{
        'id': str(p.id),
        'name': p.name,
        'image_url': p.image_ipfs_hash,
        'rarity': p.rarity,
        'planet_type': p.planet_type,
        'coord_x': p.coord_x,
        'coord_y': p.coord_y,
        'coord_z': p.coord_z,
        'minted': p.minted,
        'discovery_date': p.created_at.isoformat(),
        'description': p.description,
    } for p in planets]

    stats = {
        'total_discovered': len(results),
        'total_minted': sum(1 for p in planets if p.minted),
        'legendary': sum(1 for p in planets if p.rarity == 'Legendary'),
        'mythic': sum(1 for p in planets if p.rarity == 'Mythic'),
        'total_expeditions': user.free_discoveries_used + user.paid_discoveries_available,
    }
    return jsonify({'planets': results, 'statistics': stats})
