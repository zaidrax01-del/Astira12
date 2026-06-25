from flask import Blueprint, request, jsonify
from models import db, User
from config import Config
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from solders.signature import Signature

payment_bp = Blueprint('payment', __name__)
TREASURY_WALLET = Pubkey.from_string(Config.TREASURY_WALLET)
client = Client("https://api.mainnet-beta.solana.com")
COST_PER_DISCOVERY_SOL = 0.002

@payment_bp.route('/purchase-discovery', methods=['POST'])
def purchase_discovery():
    wallet_address = request.headers.get('X-User-Id')
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    signature = data.get('signature')
    if not signature:
        return jsonify({'error': 'Missing signature'}), 400

    try:
        sig = Signature.from_string(signature)
        tx = client.get_transaction(sig, encoding="jsonParsed", max_supported_transaction_version=0)
        if not tx.value:
            return jsonify({'error': 'Transaction not found'}), 404

        # Production: verify amount and recipient from parsed transaction.
        # For now we trust the frontend check and grant one discovery.
        user.paid_discoveries_available += 1
        db.session.commit()
        return jsonify({'success': True, 'paid_discoveries_available': user.paid_discoveries_available})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
