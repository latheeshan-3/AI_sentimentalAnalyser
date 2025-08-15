import os
from dotenv import load_dotenv

# Get the absolute path to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Try loading .env from backend folder
env_path = os.path.join(BASE_DIR, ".env")
if not os.path.exists(env_path):
    # fallback to parent folder
    env_path = os.path.join(BASE_DIR, "..", ".env")

load_dotenv(dotenv_path=env_path)

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if GROQ_API_KEY is None:
    raise ValueError(f"GROQ_API_KEY environment variable is not set. Tried loading from: {env_path}")
