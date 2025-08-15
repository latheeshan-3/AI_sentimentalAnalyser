from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from pymongo import MongoClient
from config import MONGODB_URI, DB_NAME

router = APIRouter()

client = MongoClient(MONGODB_URI)
if DB_NAME is None:
    raise ValueError("DB_NAME must not be None")
db = client[DB_NAME]
feedback_collection = db["feedbacks"]

@router.get("/api/feedback/trend")
def get_feedback_trend(range: str = Query("7d")):
    """
    Returns sentiment trends for the past 7 days, 30 days, or 1 year.
    Groups data by date and sentiment label.
    """
    now = datetime.utcnow()

    if range == "7d":
        start_date = now - timedelta(days=7)
    elif range == "30d":
        start_date = now - timedelta(days=30)
    elif range == "1y":
        start_date = now - timedelta(days=365)
    else:
        return {"error": "Invalid range"}

    pipeline = [
        {"$match": {"createdAt": {"$gte": start_date}}},
        {
            "$group": {
                "_id": {
                    "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}},
                    "label": "$sentiment.label"
                },
                "avgScore": {"$avg": "$sentiment.score"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.date": 1}}
    ]

    results = list(feedback_collection.aggregate(pipeline))
    return {"data": results}
