from fastapi import APIRouter
from schemas.feedback_schema import FeedbackCreate, FeedbackResponse
from services.feedback_service import handle_feedback_submission



router = APIRouter()

@router.post("/api/feedback")
def submit_feedback(feedback: FeedbackCreate):
    result = handle_feedback_submission(feedback.text)
    sentiment = result["sentiment"]

    return {
        "id": result["id"],
        "text": result["text"],
        "sentiment": sentiment,
        "createdAt": result["createdAt"],
        "response": sentiment["response"]  # default value
    }




