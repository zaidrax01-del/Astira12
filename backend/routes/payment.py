from flask import Blueprint, request, jsonify
from models import db, User
from config import Config

payment_bp = Blueprint('payment', __name__)
COST_PER_DISCOVERY_SOL = 0.002

@payment_bp.route('/purchase-discovery', methods=['POST'])
def purchase_discovery():
    wallet_address = request.headers.get('X-User-Id')
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'error': 'Explorer not found'}), 404

    data = request.get_json()
    signature = data.get('signature')
    if not signature:
        return jsonify({'error': 'Missing signature'}), 400

    # In production: verify the transaction on‑chain here.
    # For now, we trust the frontend has sent the correct amount to the treasury.
    user.paid_discoveries_available += 1
    db.session.commit()

    return jsonify({
        'success': True,
        'paid_discoveries_available': user.paid_discoveries_available
    })
