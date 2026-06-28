from flask import Blueprint, request, jsonify
from services.universe_engine import discover_planet

planet_bp = Blueprint('planet', __name__)

@planet_bp.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')
    art_style = data.get('art_style', 'Cosmic')
    creativity = data.get('creativity', 'Balanced')

    planet_data = discover_planet(prompt, art_style, creativity)
    if not planet_data:
        return jsonify({'error': 'Discovery failed'}), 500

    return jsonify({
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
    })
