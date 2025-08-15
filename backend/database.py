from pymongo import MongoClient
from .config import MONGODB_URI, DB_NAME

client = MongoClient(MONGODB_URI)
if client is None:
	raise ValueError("Failed to connect to MongoDB. Check MONGODB_URI.")

if DB_NAME is None:
	raise ValueError("DB_NAME is None. Please check your configuration.")
db = client[DB_NAME]

# Create index for createdAt
db.feedback.create_index("createdAt")
