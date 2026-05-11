from flask import Blueprint, request, jsonify
from models import db, User

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/unlock-premium', methods=['POST'])
def unlock_premium():
    wallet_address = request.headers.get('X-User-Id')
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # In a real scenario you would verify the on‑chain transaction here.
    # For now, we simply mark the premium flag.
    user.has_premium_generation = True
    db.session.commit()
    return jsonify({'success': True, 'has_premium': True})
