from flask import Blueprint, request, jsonify
from services.universe_engine import discover_planet
import uuid
import threading

planet_bp = Blueprint('planet', __name__)
task_store = {}

def run_discovery(task_id, prompt):
    """Background thread – just runs the universe engine and stores the result."""
    try:
        planet_data = discover_planet(prompt)
        if not planet_data:
            task_store[task_id] = {'status': 'error', 'message': 'Discovery failed'}
            return

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
            }
        }
    except Exception as e:
        task_store[task_id] = {'status': 'error', 'message': str(e)}


@planet_bp.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')

    task_id = str(uuid.uuid4())
    task_store[task_id] = {'status': 'processing'}

    thread = threading.Thread(target=run_discovery, args=(task_id, prompt))
    thread.daemon = True
    thread.start()

    return jsonify({'task_id': task_id, 'status': 'processing'})


@planet_bp.route('/generate/status/<task_id>', methods=['GET'])
def generation_status(task_id):
    task = task_store.get(task_id)
    if not task:
        return jsonify({'status': 'not_found'}), 404
    return jsonify(task)
