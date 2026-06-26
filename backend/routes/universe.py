from flask import Blueprint, request, jsonify
from models import db, Planet, User, ExplorerAchievement
from sqlalchemy import func

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
            (Planet.planet_type.ilike(f'%{search}%'))
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
            'discovery_number': p.discovery_number,
            'size_class': p.size_class,
            'value_index': p.value_index,
            'events': p.events,
            'rare_discovery': p.rare_discovery,
            'description': p.description,
            'discovery_date': p.created_at.isoformat(),
        })
    return jsonify({'planets': results, 'total': planets.total, 'pages': planets.pages, 'current_page': page})

@universe_bp.route('/stats', methods=['GET'])
def universe_stats():
    total_explorers = db.session.query(func.count(User.id)).scalar()
    total_planets = Planet.query.filter_by(is_deleted=False).count()
    total_minted = Planet.query.filter_by(minted=True, is_deleted=False).count()
    legendary = Planet.query.filter_by(rarity='Legendary', is_deleted=False).count()
    mythic = Planet.query.filter_by(rarity='Mythic', is_deleted=False).count()
    newest = Planet.query.filter_by(is_deleted=False).order_by(Planet.discovery_number.desc()).first()
    latest_explorer = User.query.order_by(User.created_at.desc()).first()

    return jsonify({
        'total_explorers': total_explorers,
        'total_planets_discovered': total_planets,
        'total_planets_minted': total_minted,
        'legendary_planets': legendary,
        'mythic_planets': mythic,
        'newest_discovery': {
            'name': newest.name if newest else '',
            'discovery_number': newest.discovery_number if newest else 0,
        } if newest else None,
        'latest_explorer': latest_explorer.wallet_address[:6] + '...' + latest_explorer.wallet_address[-4:] if latest_explorer else ''
    })
