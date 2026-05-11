from flask import Blueprint, request, jsonify
from models import Planet, User

compass_bp = Blueprint('compass', __name__)

@compass_bp.route('/planets', methods=['GET'])
def get_planets():
    search = request.args.get('search', '')
    planet_type = request.args.get('type', '')
    rarity = request.args.get('rarity', '')
    creator = request.args.get('creator', '')
    page = int(request.args.get('page', 1))
    per_page = 24

    query = Planet.query.filter_by(is_deleted=False)
    if search:
        query = query.filter(Planet.name.ilike(f'%{search}%'))
    if planet_type:
        query = query.filter(Planet.planet_type == planet_type)
    if rarity:
        query = query.filter(Planet.rarity == rarity)
    if creator:
        user = User.query.filter_by(wallet_address=creator).first()
        if user:
            query = query.filter(Planet.creator_id == user.id)

    planets = query.order_by(Planet.created_at.desc()).paginate(page=page, per_page=per_page)
    result = []

    # Safe placeholder image when IPFS is missing
    SAFE_PLACEHOLDER = "https://i.ibb.co/ksmf765n/file-000000007a6471f4a9a08e6544335adb.png"

    for p in planets.items:
        if p.image_ipfs_hash:
            # If it already looks like a full URL, use it; otherwise build gateway URL
            if p.image_ipfs_hash.startswith('http'):
                image_url = p.image_ipfs_hash
            else:
                image_url = f"https://gateway.pinata.cloud/ipfs/{p.image_ipfs_hash}"
        else:
            image_url = SAFE_PLACEHOLDER

        result.append({
            'id': str(p.id),
            'name': p.name,
            'image_url': image_url,
            'rarity': p.rarity,
            'planet_type': p.planet_type,
            'creator': p.creator.wallet_address,
            'created_at': p.created_at.isoformat()
        })

    return jsonify({
        'planets': result,
        'total': planets.total,
        'pages': planets.pages,
        'current_page': page
    })
