from models import db, Planet, RewardPool, RewardAllocation, User
from services.token_service import add_transaction

def create_reward_pool(planet_id, generation_fee):
    planet = Planet.query.get(planet_id)
    if not planet or not planet.derivative_root_id:
        return None
    fee_amount = generation_fee * 0.15
    pool = RewardPool(
        derivative_planet_id=planet_id,
        total_fee_collected=fee_amount
    )
    db.session.add(pool)
    db.session.commit()
    allocate_rewards(pool)
    return pool

def allocate_rewards(pool):
    # Load the derivative planet explicitly
    derivative_planet = Planet.query.get(pool.derivative_planet_id)
    if not derivative_planet or not derivative_planet.derivative_root_id:
        return

    root_id = derivative_planet.derivative_root_id
    holders = []
    current_id = root_id
    while current_id and len(holders) < 16:
        planet = Planet.query.get(current_id)
        if planet and planet.creator_id not in [h['user_id'] for h in holders]:
            holders.append({'user_id': planet.creator_id, 'depth': len(holders)})
        if planet and planet.parent_ids:
            current_id = planet.parent_ids[0]
        else:
            break

    total = float(pool.total_fee_collected)
    weights = []
    for h in holders:
        if h['depth'] == 0:
            weights.append(0.5)
        else:
            weights.append(0.5 / (2 ** h['depth']))
    total_weight = sum(weights)
    for i, h in enumerate(holders):
        share = (weights[i] / total_weight) * total
        alloc = RewardAllocation(
            pool_id=pool.id,
            recipient_id=h['user_id'],
            share_percent=weights[i] / total_weight * 100,
            amount=share
        )
        db.session.add(alloc)
    db.session.commit()

def claim_reward(allocation_id, user_id):
    alloc = RewardAllocation.query.get(allocation_id)
    if alloc and str(alloc.recipient_id) == str(user_id) and not alloc.claimed:
        add_transaction(alloc.recipient_id, 'reward', alloc.amount, 'reward_claim')
        alloc.claimed = True
        db.session.commit()
        return True
    return False
