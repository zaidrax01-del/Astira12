from flask import Blueprint, request, jsonify
from models import db, User, Planet, ExplorerAchievement

explorer_bp = Blueprint('explorer', __name__)

ACHIEVEMENTS = {
    'first_discovery': 'First Discovery',
    'five_discoveries': 'Five Discoveries',
    'ten_discoveries': 'Ten Discoveries',
    'legendary_finder': 'Legendary Finder',
    'mythic_explorer': 'Mythic Explorer',
    'planet_collector': 'Planet Collector',
    'master_explorer': 'Master Explorer',
}

def check_and_award_achievements(wallet_address):
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return
    planet_count = Planet.query.filter_by(creator_id=user.id, is_deleted=False).count()
    legendary_count = Planet.query.filter_by(creator_id=user.id, rarity='Legendary', is_deleted=False).count()
    mythic_count = Planet.query.filter_by(creator_id=user.id, rarity='Mythic', is_deleted=False).count()

    achievements = []
    if planet_count >= 1:
        achievements.append('first_discovery')
    if planet_count >= 5:
        achievements.append('five_discoveries')
    if planet_count >= 10:
        achievements.append('ten_discoveries')
    if legendary_count >= 1:
        achievements.append('legendary_finder')
    if mythic_count >= 1:
        achievements.append('mythic_explorer')
    if planet_count >= 50:
        achievements.append('planet_collector')
    if planet_count >= 100:
        achievements.append('master_explorer')

    for ach in achievements:
        exists = ExplorerAchievement.query.filter_by(wallet_address=wallet_address, achievement_name=ach).first()
        if not exists:
            db.session.add(ExplorerAchievement(wallet_address=wallet_address, achievement_name=ach))
    db.session.commit()

@explorer_bp.route('/discoveries', methods=['GET'])
def explorer_discoveries():
    wallet = request.headers.get('X-User-Id')
    if not wallet:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(wallet_address=wallet).first()
    if not user:
        return jsonify({'error': 'Explorer not found'}), 404

    # Auto-award achievements
    check_and_award_achievements(wallet)

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
        'discovery_number': p.discovery_number,
        'size_class': p.size_class,
        'value_index': p.value_index,
        'events': p.events,
        'rare_discovery': p.rare_discovery,
    } for p in planets]

    stats = {
        'total_discovered': len(results),
        'total_minted': sum(1 for p in planets if p.minted),
        'legendary': sum(1 for p in planets if p.rarity == 'Legendary'),
        'mythic': sum(1 for p in planets if p.rarity == 'Mythic'),
        'total_expeditions': user.free_discoveries_used + user.paid_discoveries_available,
    }

    achievements = ExplorerAchievement.query.filter_by(wallet_address=wallet).all()
    achievement_list = [ACHIEVEMENTS.get(a.achievement_name, a.achievement_name) for a in achievements]

    return jsonify({'planets': results, 'statistics': stats, 'achievements': achievement_list})
