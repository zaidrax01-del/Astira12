from models import db, TokenLedger, User

def get_balance(user_id):
    user = User.query.get(user_id)
    if not user:
        return 0
    # sum of all transactions
    from sqlalchemy import func
    result = db.session.query(func.sum(TokenLedger.amount)).filter(
        TokenLedger.user_id == user_id
    ).scalar()
    return float(result or 0)

def deduct_ast(user, amount):
    bal = get_balance(user.id)
    if bal < amount:
        return False
    add_transaction(user, 'spend', -amount, 'deduction')
    return True

def add_transaction(user, tx_type, amount, status='completed'):
    new_bal = get_balance(user.id) + amount
    tx = TokenLedger(
        user_id=user.id,
        type=tx_type,
        amount=amount,
        balance_after=new_bal,
        status=status
    )
    db.session.add(tx)
    db.session.commit()
