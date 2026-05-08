import numpy as np
from models import Planet

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def check_derivative(new_style_sig):
    planets = Planet.query.filter(Planet.style_signature != None).all()
    best_sim = 0
    best_planet = None
    for p in planets:
        sim = cosine_similarity(new_style_sig, p.style_signature)
        if sim > best_sim:
            best_sim = sim
            best_planet = p
    if best_sim > 0.85:
        return best_planet.id, best_sim
    return None, 0
