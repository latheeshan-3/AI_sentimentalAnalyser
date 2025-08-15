from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
import json
from config import GROQ_API_KEY
from pydantic import SecretStr

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY must not be None")

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=SecretStr(GROQ_API_KEY)
)

prompt_template = PromptTemplate(
    input_variables=["feedback"],
    template="""
You are a polite AI assistant. Analyze the following customer feedback and return ONLY valid JSON with these keys:

- "label": "positive", "negative", or "neutral"
- "score": a float between 0 and 1
- "response": a polite message to reply to the customer based on their feedback

Feedback: {feedback}
"""
)

def classify_sentiment(feedback_text: str) -> dict:
    prompt = prompt_template.format(feedback=feedback_text)
    
    try:
        result = llm.invoke(prompt)

        # Extract the JSON string properly
        if isinstance(result, list) and hasattr(result[0], "content"):
            response = result[0].content.strip()
        elif hasattr(result, "content"):
            response = str(result.content).strip()
        else:
            response = str(result).strip()

        # Remove any surrounding Markdown backticks
        response = response.strip("`").strip()

        print("Processed response for JSON:", response)

        parsed = json.loads(response)
        return {
            "label": parsed.get("label", "neutral"),
            "score": parsed.get("score", 0.0),
            "response": parsed.get("response", "Thank you for your feedback!")
        }

    except Exception as e:
        print("Error in classify_sentiment:", e)
        return {"label": "neutral", "score": 0.0, "response": "Thank you for your feedback!"}