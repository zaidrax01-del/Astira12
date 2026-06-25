from flask import Blueprint, request, jsonify
from models import Planet, User

universe_bp = Blueprint('universe', __name__)

@universe_bp.route('/planets', methods=['GET'])
def get_universe_planets():
    search = request.args.get('search', '')
    planet_type = request.args.get('type', '')
    rarity = request.args.get('rarity', '')
    has_rings = request.args.get('has_rings', '')
    has_moons = request.args.get('has_moons', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))

    query = Planet.query.filter_by(is_deleted=False)
    if search:
        query = query.filter(
            (Planet.name.ilike(f'%{search}%')) |
            (Planet.image_ipfs_hash.ilike(f'%{search}%'))   # placeholder for DNA
        )
    if planet_type:
        query = query.filter(Planet.planet_type == planet_type)
    if rarity:
        query = query.filter(Planet.rarity == rarity)

    planets = query.order_by(Planet.created_at.desc()).paginate(page=page, per_page=per_page)
    results = []
    for p in planets.items:
        creator = User.query.get(p.creator_id)
        results.append({
            'id': str(p.id),
            'name': p.name,
            'image_url': p.image_ipfs_hash,
            'planet_type': p.planet_type,
            'rarity': p.rarity,
            'coord_x': p.coord_x,
            'coord_y': p.coord_y,
            'coord_z': p.coord_z,
            'creator_wallet': creator.wallet_address if creator else '0xAstiraSeed',
            'minted': p.minted,
            'moons': 0,        # placeholder – you may store these in metadata
            'rings': False,
            'atmosphere': 'Unknown',
            'description': p.description,
        })
    return jsonify({
        'planets': results,
        'total': planets.total,
        'pages': planets.pages,
        'current_page': page
    })
