from datetime import datetime
from bson import ObjectId
from ..database import db

def create_feedback(text: str, sentiment: dict):
    feedback_doc = {
        "text": text,
        "sentiment": sentiment,
        "createdAt": datetime.utcnow()
    }
    result = db.feedback.insert_one(feedback_doc)
    return str(result.inserted_id)
