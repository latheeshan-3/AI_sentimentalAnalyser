# AI Sentimental Web Application

Author - LATHEESHAN THIRUCHANDURAN
University - UNIVERSITY OF MORATUWA 
Year- 3rd Year 
DEMO VIDEO PITCH (DRIVE LINK)  -   https://drive.google.com/drive/folders/18JDLC2nvdR85czxg4o0ivf_PQpYSlhbL?usp=sharing

          Drive folder includes working vido demonstration + interface Images 

          

## 📌 Project Overview
This project is a **multi-agent feedback analysis and response system** built with **FastAPI (backend)** and **Next.js (frontend)**. It uses **LangChain / LlamaIndex** with LLMs to automate customer sentiment analysis and feedback response generation.  

The system is designed to:
1. **Agent 1 – Customer Feedback Response Agent**  
   - Accepts customer feedback as input.  
   - Uses an LLM to classify sentiment (Positive / Negative / Neutral).  
   - Generates a short, polite, and context-aware automated reply.  

2. **Agent 2 – Sentiment Visualization Agent**  
   - Accepts a date range (e.g., “last 7 days”, or “June 1 to June 15”).  
   - Dynamically generates bar/line plots showing the number of positive, negative, and neutral reviews per day.  

---

## 🛠️ Tools & Technologies
- **Backend:** FastAPI, Uvicorn, Pydantic, Pymongo, Requests  
- **Frontend:** Next.js (React framework)  
- **Frameworks:** LangChain / LlamaIndex  
- **LLMs:**  HuggingFace Transformers, Groq LLM (via `langchain_groq`)  
- **Python Libraries:** pandas, matplotlib, plotly  
- **Dataset:** defind script backend 

---


## 📂 Project Structure

#backend/
│── controllers/ # API route handlers
│ ├── feedback_controller.py
│ ├── feedback_trend_controller.py
│
│── models/ # Database models
│ ├── feedback_model.py
│
│── schemas/ # Pydantic schemas
│ ├── feedback_schema.py
│
│── services/ # Business logic & AI services
│ ├── ai_sentiment.py
│ ├── feedback_service.py
│
│── venv/ # (Optional) Virtual environment
│
│── auth.py # Authentication logic
│── config.py # Configuration settings
│── database.py # MongoDB connection
│── main.py # FastAPI entry point
│── mock_feedback_data.py # Mock data for testing
│── requirements.txt # Project dependencies
│── .env # Environment variables


#frontend/
│── public/ # Static assets (images, icons, etc.)
│── src/app/ # App Router pages
│ ├── feedback/visualization/ # Feedback visualization pages
│ │ ├── page.tsx
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│
│── .gitignore
│── eslint.config.mjs # ESLint configuration
│── next-env.d.ts # Next.js type definitions
│── next.config.ts # Next.js configuration
│── package.json # Project dependencies
│── package-lock.json # Lockfile
│── postcss.config.mjs # PostCSS configuration
│── tsconfig.json # TypeScript configuration
│── README.md # Documentation





🛠️ Full Project Setup & Running Guide


PREREQUSTS

✅ Prerequisites for  Project

🔹 General Tools (must have installed)

Git → for cloning and version control

Python 3.9+ → required for FastAPI + LangChain

Node.js 18+ and npm (or yarn) → required for Next.js frontend

MongoDB (local or cloud via MongoDB Atlas) → for storing feedback data

Virtual Environment (venv) → to manage Python dependencies



1️⃣ Clone the Repository
git clone <your-repo-url>
cd <your-project-root>

2️⃣ Backend Setup (FastAPI)
Navigate to backend folder
cd backend

Create & activate virtual environment (recommended)

python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

#Install dependencies

pip install -r requirements.txt

#Setup .env file 

NOTE- ALREADY BACKEND HAS THE .env FILE , IF IT'S MISSING CREATE A NEW .env FILE AND PASTE THIS BELOW DATA 


MONGODB_URI=mongodb://localhost:27017
DB_NAME=feedback
GROQ_API_KEY=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

#Run mock data script
This will generate or load your mock data into memory / file / DB (depending on your implementation).

python mock_feedback_data.py

#SAMPLE DATA IN MONGODP LOOKS LIKES THIS 


{
  "_id": "d44f3bd6-1f7f-47b5-ae9d-ff06a05370f5",
  "text": "This is a neutral feedback example.",
  "sentiment": {
    "label": "neutral",
    "score": 0.77,
    "response": "Thanks for your neutral feedback!"
  },
  "createdAt": {
    "$date": "2025-08-15T13:03:17.838Z"
  }
}






#Start backend server

Once mock data is ready, run:

uvicorn main:app --reload



3️⃣ Frontend Setup (Next.js)
Open a new terminal & navigate to frontend

cd frontend

#Install dependencies

npm install

#Run the frontend

npm run dev


4️⃣ Running Together

#Start backend (mock API):

cd backend
uvicorn main:app --reload


#Start frontend (in another terminal):

cd frontend
npm run dev


Open in browser:
👉 http://localhost:3000

Frontend will now fetch mock feedback data from the backend API.



