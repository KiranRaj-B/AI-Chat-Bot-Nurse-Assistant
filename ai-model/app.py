from flask import Flask, request, jsonify
import pickle
import random
import os

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model, vectorizer and intents.
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
intents = pickle.load(open("intents.pkl", "rb"))

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("text", "")
    if not user_input:
        return jsonify({"reply": "Please say something."})

    # Vectorize user input
    X_input = vectorizer.transform([user_input])
    # Predict intent
    tag = model.predict(X_input)[0]

    # Find matching intent responses
    for intent in intents:
        if intent["intent"] == tag:
            return jsonify({"reply": random.choice(intent["responses"])})

    return jsonify({"reply": "Sorry, I didn't understand that."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)