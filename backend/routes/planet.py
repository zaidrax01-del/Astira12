from flask import Blueprint, request, jsonify
from models import db, User, Planet
from services.universe_engine import discover_planet
from services.lineage_service import check_derivative
from services.security import check_cooldown, check_abuse
from sqlalchemy import func
import uuid
import threading

planet_bp = Blueprint('planet', __name__)
task_store = {}

def run_discovery(wallet_address, task_id, prompt):
    """Runs in a background thread with its own DB session."""
    from app import create_app
    app = create_app()
    with app.app_context():
        try:
            user = User.query.filter_by(wallet_address=wallet_address).first()
            if not user:
                task_store[task_id] = {'status': 'error', 'message': 'Explorer not found'}
                return

            # Decrement counters (already done in main route, but we re‑check)
            if user.free_discoveries_used > 3 and user.paid_discoveries_available <= 0:
                task_store[task_id] = {'status': 'error', 'message': 'No discoveries remaining'}
                return

            planet_data = discover_planet(prompt)
            if not planet_data:
                task_store[task_id] = {'status': 'error', 'message': 'Discovery failed'}
                return

            max_num = db.session.query(func.max(Planet.discovery_number)).scalar() or 0
            discovery_number = max_num + 1

            new_planet = Planet(
                creator_id=user.id,
                name=planet_data['name'],
                description='',
                image_ipfs_hash=planet_data['image_url'],
                style_signature=planet_data['style_signature'],
                rarity=planet_data['rarity'],
                planet_type=planet_data['type'],
                generation_number=1,
                coord_x=planet_data['coord_x'],
                coord_y=planet_data['coord_y'],
                coord_z=planet_data['coord_z'],
                discovery_number=discovery_number,
                size_class=planet_data['size_class'],
                value_index=planet_data['value_index'],
                events=planet_data['events'],
                rare_discovery=planet_data['rare_discovery']
            )
            db.session.add(new_planet)
            db.session.commit()

            task_store[task_id] = {
                'status': 'complete',
                'planet': {
                    "image_url": planet_data["image_url"],
                    "style_signature": planet_data["style_signature"],
                    "name": planet_data["name"],
                    "dna": planet_data["dna"],
                    "seed": planet_data["seed"],
                    "type": planet_data["type"],
                    "atmosphere": planet_data["atmosphere"],
                    "surface": planet_data["surface"],
                    "gravity": planet_data["gravity"],
                    "temperature": planet_data["temperature"],
                    "moons": planet_data["moons"],
                    "rings": planet_data["rings"],
                    "star_system": planet_data["star_system"],
                    "dominant_color": planet_data["dominant_color"],
                    "civilization_potential": planet_data["civilization_potential"],
                    "energy_signature": planet_data["energy_signature"],
                    "rarity": planet_data["rarity"],
                    "coord_x": planet_data["coord_x"],
                    "coord_y": planet_data["coord_y"],
                    "coord_z": planet_data["coord_z"],
                    "size_class": planet_data["size_class"],
                    "value_index": planet_data["value_index"],
                    "events": planet_data["events"],
                    "rare_discovery": planet_data["rare_discovery"],
                    "discovery_number": discovery_number,
                }
            }
        except Exception as e:
            task_store[task_id] = {'status': 'error', 'message': str(e)}


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
            free_discoveries_used=0,
            paid_discoveries_available=0
        )
        db.session.add(user)
        db.session.commit()

    if check_abuse(user):
        return jsonify({'error': 'Suspicious activity detected.'}), 403
    if not check_cooldown(user):
        return jsonify({'error': 'Cooldown active. Try again later.'}), 429

    data = request.get_json()
    prompt = data.get('prompt', '')

    if user.free_discoveries_used < 3:
        user.free_discoveries_used += 1
        db.session.commit()
    elif user.paid_discoveries_available > 0:
        user.paid_discoveries_available -= 1
        db.session.commit()
    else:
        return jsonify({'error': 'payment_required'}), 402

    task_id = str(uuid.uuid4())
    task_store[task_id] = {'status': 'processing'}
    thread = threading.Thread(target=run_discovery, args=(wallet_address, task_id, prompt))
    thread.daemon = True
    thread.start()

    return jsonify({'task_id': task_id, 'status': 'processing'})


@planet_bp.route('/generate/status/<task_id>', methods=['GET'])
def generation_status(task_id):
    task = task_store.get(task_id)
    if not task:
        return jsonify({'status': 'not_found'}), 404
    return jsonify(task)


@planet_bp.route('/save', methods=['POST'])
def save_planet():
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
    derivative_root, similarity = check_derivative(style_sig) if style_sig else (None, 0)
    planet = Planet(
        creator_id=user.id,
        name=name,
        description=description,
        image_ipfs_hash=image_url,
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
        create_reward_pool(planet.id, 0)
    return jsonify({'planet_id': str(planet.id), 'name': name, 'image_url': image_url, 'message': 'Planet saved successfully!'})
