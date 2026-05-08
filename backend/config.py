import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///astira.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MODELS_LAB_API_KEY = os.environ.get('MODELS_LAB_API_KEY', '')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    PINATA_API_KEY = os.environ.get('PINATA_API_KEY', '')
    PINATA_SECRET_KEY = os.environ.get('PINATA_SECRET_KEY', '')
    IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
    FREE_GENERATIONS = 3
    COOLDOWN_SECONDS = 10
    AST_MINT_COST = 50
    AST_FUSION_COST = 120
    DERIVATIVE_FEE_PERCENT = 0.15
    MAX_LINEAGE_HOLDERS = 16
    VOTE_CAP_PERCENT = 0.05
