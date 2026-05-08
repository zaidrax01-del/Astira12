from datetime import datetime, timedelta
from models import db, User

def check_cooldown(user):
    # Simple: last generation must be > 10 seconds ago
    last_planet = sorted(user.planets, key=lambda p: p.created_at, reverse=True)
    if last_planet:
        last = last_planet[0].created_at
        if datetime.utcnow() - last < timedelta(seconds=10):
            return False
    return True

def check_abuse(user):
    # Count generations in last hour
    recent = [p for p in user.planets if (datetime.utcnow() - p.created_at).seconds < 3600]
    if len(recent) > 20:
        return True
    return False
