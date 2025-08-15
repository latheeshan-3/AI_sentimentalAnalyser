from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import uuid

# MongoDB connection
MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "feedback"  # <-- change this to your actual DB name
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db["feedbacks"]

labels = ["positive", "neutral", "negative"]

# Generate mock feedback for past 40 days
mock_data = []
for i in range(40):
    date = datetime.utcnow() - timedelta(days=i)
    for _ in range(random.randint(1, 5)):  # 1–5 feedback entries per day
        label = random.choice(labels)
        score = round(random.uniform(0.1, 1.0), 2)
        feedback_text = f"This is a {label} feedback example."
        response = f"Thanks for your {label} feedback!"

        mock_data.append({
            "_id": str(uuid.uuid4()),
            "text": feedback_text,
            "sentiment": {
                "label": label,
                "score": score,
                "response": response
            },
            "createdAt": date
        })

# Insert into database
collection.insert_many(mock_data)
print(f"Inserted {len(mock_data)} mock feedback documents into 'feedbacks' collection.")
