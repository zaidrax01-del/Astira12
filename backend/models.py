from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_address = db.Column(db.String(44), unique=True, nullable=False)
    nonce = db.Column(db.String(64), nullable=False)
    verification_status = db.Column(db.String(20), default='none')
    free_discoveries_used = db.Column(db.Integer, default=0)
    paid_discoveries_available = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_ip = db.Column(db.String(45))
    risk_score = db.Column(db.Float, default=0.0)

    planets = db.relationship('Planet', backref='creator', lazy=True)
    transactions = db.relationship('TokenLedger', backref='user', lazy=True)

class Planet(db.Model):
    __tablename__ = 'planets'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    image_ipfs_hash = db.Column(db.String(256))
    metadata_ipfs_hash = db.Column(db.String(64))
    style_signature = db.Column(JSONB)
    rarity = db.Column(db.String(20))
    planet_type = db.Column(db.String(30))
    parent_ids = db.Column(db.ARRAY(UUID(as_uuid=True)), default=[])
    derivative_root_id = db.Column(UUID(as_uuid=True), db.ForeignKey('planets.id'), nullable=True)
    generation_number = db.Column(db.Integer, default=1)
    minted = db.Column(db.Boolean, default=False)
    token_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False)

    # Permanent coordinates
    coord_x = db.Column(db.Integer, default=0)
    coord_y = db.Column(db.Integer, default=0)
    coord_z = db.Column(db.Integer, default=0)

    # New fields for living universe
    discovery_number = db.Column(db.Integer, nullable=True)        # sequential, unique
    size_class = db.Column(db.String(20))                          # Tiny/Small/Medium/Large/Massive/Titan/Colossal
    value_index = db.Column(db.Float, default=0.0)                 # 0-100
    events = db.Column(db.String(255))                             # comma-separated events
    rare_discovery = db.Column(db.String(100), nullable=True)      # e.g., "Ancient Civilization Detected"

class TokenLedger(db.Model):
    __tablename__ = 'token_ledger'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20))
    amount = db.Column(db.Numeric(18,6))
    balance_after = db.Column(db.Numeric(18,6))
    tx_hash = db.Column(db.String(66))
    status = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Proposal(db.Model):
    __tablename__ = 'proposals'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    governance_layer = db.Column(db.String(30))
    title = db.Column(db.Text)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')
    end_timestamp = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Vote(db.Model):
    __tablename__ = 'votes'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('proposals.id'), nullable=False)
    voter_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    vote_power = db.Column(db.Numeric(18,6))
    support = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RewardPool(db.Model):
    __tablename__ = 'reward_pools'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    derivative_planet_id = db.Column(UUID(as_uuid=True), db.ForeignKey('planets.id'), nullable=False)
    total_fee_collected = db.Column(db.Numeric(18,6))
    distributed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RewardAllocation(db.Model):
    __tablename__ = 'reward_allocations'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pool_id = db.Column(UUID(as_uuid=True), db.ForeignKey('reward_pools.id'), nullable=False)
    recipient_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    share_percent = db.Column(db.Numeric(5,2))
    amount = db.Column(db.Numeric(18,6))
    claimed = db.Column(db.Boolean, default=False)
    tx_hash = db.Column(db.String(66))

class ExplorerAchievement(db.Model):
    __tablename__ = 'explorer_achievements'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_address = db.Column(db.String(44), nullable=False)
    achievement_name = db.Column(db.String(50), nullable=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
