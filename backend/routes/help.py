from flask import Blueprint, request, jsonify
from services.help_ai import ask_astira

help_bp = Blueprint('help', __name__)

@help_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question')
    history = data.get('history', [])
    answer = ask_astira(question, history)
    return jsonify({'answer': answer})

@help_bp.route('/faq', methods=['GET'])
def faq():
    faqs = [
        {"q": "What is Astira?", "a": "Astira is an AI-powered planet generation platform..."},
        {"q": "How many free generations do I get?", "a": "Every new wallet receives 3 free generations."},
        {"q": "What is AST?", "a": "AST is the utility token used for minting, fusion, and governance."},
        {"q": "What is the Cosmic Compass?", "a": "A permanent archive of all generated planets."},
        {"q": "How does planet fusion work?", "a": "Combine two compatible planets to create a new one."},
        {"q": "What are derivative rewards?", "a": "If your planet style inspires later generations, you earn AST."},
        {"q": "How does governance work?", "a": "Three-layer voting: Planet Holder, Economic, and Style-specific."},
        {"q": "Can I get a refund?", "a": "Only for failed generations or system errors."},
        {"q": "What is the AST token contract?", "a": "Coming soon on Ethereum mainnet."},
        {"q": "How do I mint a planet as NFT?", "a": "After generation, you can mint it using AST."},
        {"q": "What are the rarities?", "a": "Common, Uncommon, Rare, Epic, Legendary."},
        {"q": "How is voting power calculated?", "a": "Base from planets owned + AST influence, capped per wallet."},
        {"q": "Is my wallet secure?", "a": "We never access your private keys. All transactions are signed client-side."},
        {"q": "What is the maximum supply of AST?", "a": "1 billion AST."},
        {"q": "How do I contact support?", "a": "Use the AI chat or reach out on Twitter/Telegram."}
    ]
    return jsonify(faqs)
