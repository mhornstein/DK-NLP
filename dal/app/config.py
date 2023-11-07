import os

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
PORT = int(os.environ.get('PORT', 5000))