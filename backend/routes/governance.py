from flask import Blueprint, request, jsonify
from models import db, User, Proposal, Vote
from services.governance_engine import calc_vote_power

governance_bp = Blueprint('governance', __name__)

@governance_bp.route('/proposals', methods=['GET'])
def list_proposals():
    layer = request.args.get('layer', '')
    status = request.args.get('status', 'active')
    query = Proposal.query
    if layer:
        query = query.filter_by(governance_layer=layer)
    if status:
        query = query.filter_by(status=status)
    proposals = query.order_by(Proposal.created_at.desc()).all()
    return jsonify([{
        'id': str(p.id),
        'title': p.title,
        'layer': p.governance_layer,
        'status': p.status,
        'end_timestamp': p.end_timestamp.isoformat()
    } for p in proposals])

@governance_bp.route('/proposals', methods=['POST'])
def create_proposal():
    user_id = request.headers.get('X-User-Id')
    data = request.get_json()
    proposal = Proposal(
        proposer_id=user_id,
        governance_layer=data['layer'],
        title=data['title'],
        description=data['description'],
        end_timestamp=data['end_timestamp']
    )
    db.session.add(proposal)
    db.session.commit()
    return jsonify({'proposal_id': str(proposal.id)}), 201

@governance_bp.route('/vote', methods=['POST'])
def cast_vote():
    user_id = request.headers.get('X-User-Id')
    data = request.get_json()
    proposal = Proposal.query.get(data['proposal_id'])
    if not proposal:
        return jsonify({'error': 'Proposal not found'}), 404

    power = calc_vote_power(user_id)
    vote = Vote(
        proposal_id=proposal.id,
        voter_id=user_id,
        vote_power=power,
        support=data['support']
    )
    db.session.add(vote)
    db.session.commit()
    return jsonify({'vote_power': power, 'success': True})
