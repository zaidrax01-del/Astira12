from flask import Blueprint, request, jsonify
from models import db, User
import uuid
from eth_account.messages import encode_defunct
from eth_account import Account

auth_bp = Blueprint('auth', __name__)

def validate_wallet(address):
    return len(address) == 42 and address.startswith('0x')

@auth_bp.route('/nonce', methods=['POST'])
def get_nonce():
    data = request.get_json()
    wallet = data.get('wallet_address')
    if not validate_wallet(wallet):
        return jsonify({'error': 'Invalid wallet address'}), 400
    user = User.query.filter_by(wallet_address=wallet).first()
    if not user:
        user = User(wallet_address=wallet, nonce=str(uuid.uuid4()))
        db.session.add(user)
        db.session.commit()
    return jsonify({'nonce': user.nonce})

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    wallet = data.get('wallet_address')
    signature = data.get('signature')
    user = User.query.filter_by(wallet_address=wallet).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    message = f"Sign this message to login to Astira: {user.nonce}"
    message_hash = encode_defunct(text=message)
    recovered = Account.recover_message(message_hash, signature=signature)
    if recovered.lower() == wallet.lower():
        user.nonce = str(uuid.uuid4())
        db.session.commit()
        # Return a token (simplified, use JWT in production)
        return jsonify({'token': 'mock-jwt-token', 'user_id': str(user.id)})
    return jsonify({'error': 'Invalid signature'}), 401
