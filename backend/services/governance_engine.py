from models import User, Planet, TokenLedger, db
from sqlalchemy import func

def calc_vote_power(user_id):
    user = User.query.get(user_id)
    if not user:
        return 0
    planet_count = Planet.query.filter_by(creator_id=user_id, is_deleted=False).count()
    ast_balance = db.session.query(func.sum(TokenLedger.amount)).filter(
        TokenLedger.user_id == user_id,
        TokenLedger.type.in_(['mint', 'reward', 'purchase', 'refund'])
    ).scalar() or 0
    ast_influence = abs(ast_balance) * 0.1
    max_cap = 50000  # 5% of 1M mock supply
    return min(planet_count + ast_influence, max_cap)
