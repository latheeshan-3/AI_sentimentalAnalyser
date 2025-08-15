from services.ai_sentiment import classify_sentiment
from config import MONGODB_URI, DB_NAME
import uuid
from pymongo import MongoClient
from datetime import datetime

client = MongoClient(MONGODB_URI)
if DB_NAME is None:
    raise ValueError("DB_NAME must be set and not None")
db = client[DB_NAME]
feedback_collection = db["feedbacks"]

def handle_feedback_submission(feedback_text: str) -> dict:
    sentiment_data = classify_sentiment(feedback_text)
    feedback_id = str(uuid.uuid4())

    doc = {
        "_id": feedback_id,
        "text": feedback_text,
        "sentiment": sentiment_data,
        "createdAt": datetime.utcnow()
    }

    feedback_collection.insert_one(doc)

    return {
        "id": feedback_id,
        "text": feedback_text,
        "sentiment": sentiment_data,
        "createdAt": doc["createdAt"].isoformat() + "Z"
       
    }

