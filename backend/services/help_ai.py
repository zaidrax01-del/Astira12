import openai
from flask import current_app
from .knowledge_base import find_answer

def ask_astira(question, history):
    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        # Use local knowledge base
        return find_answer(question)

    # If OpenAI key is available, use it as before
    context = """
    You are Astira AI, the assistant for the Astira platform.
    Answer questions based on the Astira whitepaper knowledge.
    """
    messages = [{"role": "system", "content": context}]
    for entry in history[-10:]:
        messages.append({"role": entry["role"], "content": entry["content"]})
    messages.append({"role": "user", "content": question})
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200
        )
        return response.choices[0].message['content']
    except:
        return "Sorry, I encountered an error. Please try again later."
