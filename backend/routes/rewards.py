from flask import Blueprint, request, jsonify
from models import db, RewardAllocation
from services.reward_engine import claim_reward
from services.token_service import get_balance

rewards_bp = Blueprint('rewards', __name__)

@rewards_bp.route('/dashboard', methods=['GET'])
def reward_dashboard():
    user_id = request.headers.get('X-User-Id')
    allocations = RewardAllocation.query.filter_by(recipient_id=user_id).all()
    total_earned = sum(float(a.amount) for a in allocations)
    total_claimed = sum(float(a.amount) for a in allocations if a.claimed)
    return jsonify({
        'total_earned': total_earned,
        'total_claimed': total_claimed,
        'allocations': [{
            'id': str(a.id),
            'amount': float(a.amount),
            'claimed': a.claimed,
            'pool_id': str(a.pool_id)
        } for a in allocations]
    })

@rewards_bp.route('/claim/<allocation_id>', methods=['POST'])
def claim(allocation_id):
    user_id = request.headers.get('X-User-Id')
    success = claim_reward(allocation_id, user_id)
    if success:
        return jsonify({'success': True})
    return jsonify({'error': 'Claim failed'}), 400
