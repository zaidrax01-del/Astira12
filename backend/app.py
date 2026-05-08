from flask import Flask
from flask_cors import CORS
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    with app.app_context():
        db.create_all()

    from routes.auth import auth_bp
    from routes.planet import planet_bp
    from routes.compass import compass_bp
    from routes.fusion import fusion_bp
    from routes.governance import governance_bp
    from routes.rewards import rewards_bp
    from routes.help import help_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(planet_bp, url_prefix='/api/v1/planet')
    app.register_blueprint(compass_bp, url_prefix='/api/v1/compass')
    app.register_blueprint(fusion_bp, url_prefix='/api/v1/fusion')
    app.register_blueprint(governance_bp, url_prefix='/api/v1/governance')
    app.register_blueprint(rewards_bp, url_prefix='/api/v1/rewards')
    app.register_blueprint(help_bp, url_prefix='/api/v1/help')

    @app.route('/api/v1/health')
    def health():
        return {'status': 'ok'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
