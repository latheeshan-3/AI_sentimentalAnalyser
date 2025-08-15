from pydantic import BaseModel

class FeedbackCreate(BaseModel):
    text: str

class FeedbackResponse(BaseModel):
    id: str
    text: str
    sentiment: dict
    createdAt: str
