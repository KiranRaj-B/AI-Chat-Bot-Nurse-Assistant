import json
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load intents file
with open("intents.json", "r") as f:
    data = json.load(f)

texts = []  # user input examples
labels = []  # intent tags

for intent in data["intents"]:
    for text in intent["text"]:
        texts.append(text)
        labels.append(intent["intent"])

# Vectorize the texts
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# Train classifier
model = LogisticRegression()
model.fit(X, labels)

# Save everything to disk
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("intents.pkl", "wb") as f:
    pickle.dump(data["intents"], f)

print("Training complete and files saved!")
