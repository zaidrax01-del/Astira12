from flask import Blueprint, request, jsonify
from models import db, User
import uuid
import base58
from nacl.signing import VerifyKey

auth_bp = Blueprint('auth', __name__)

def validate_solana_address(address):
    try:
        decoded = base58.b58decode(address)
        return len(decoded) == 32
    except:
        return False

def verify_signature(public_key: str, message: bytes, signature_b58: str) -> bool:
    try:
        verify_key = VerifyKey(base58.b58decode(public_key))
        signature = base58.b58decode(signature_b58)
        verify_key.verify(smessage=message, signature=signature)
        return True
    except:
        return False

@auth_bp.route('/nonce', methods=['POST'])
def get_nonce():
    data = request.get_json()
    wallet = data.get('wallet_address')
    if not validate_solana_address(wallet):
        return jsonify({'error': 'Invalid Solana address'}), 400
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
    signature_b58 = data.get('signature')
    user = User.query.filter_by(wallet_address=wallet).first()
    if not user:
        return jsonify({'error': 'Explorer not found'}), 404
    message = f"Sign this message to login to Astira: {user.nonce}"
    message_bytes = message.encode('utf-8')
    if verify_signature(wallet, message_bytes, signature_b58):
        user.nonce = str(uuid.uuid4())
        db.session.commit()
        return jsonify({'token': 'sol-mock-jwt', 'user_id': str(user.id)})
    return jsonify({'error': 'Invalid signature'}), 401

@auth_bp.route('/status', methods=['GET'])
def explorer_status():
    wallet_address = request.headers.get('X-User-Id')
    if not wallet_address:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'error': 'Explorer not found'}), 404
    return jsonify({
        'wallet_address': user.wallet_address,
        'free_discoveries_used': user.free_discoveries_used,
        'paid_discoveries_available': user.paid_discoveries_available,
    })
