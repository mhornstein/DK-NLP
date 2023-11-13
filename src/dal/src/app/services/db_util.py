from pymongo import MongoClient
from flask import current_app

# Note: To avoid circular import issues, I chose to load the collection here instead of in the Flask app.
# Though this approach wasn't used in the final implementation, the following serves as a clear example:
# https://dev.to/reritom/unit-testing-pymongo-flask-applications-with-mongomock-and-patches-1m23


mongo_client = None
db_name = "tags"


def create_collection_if_not_exists(db, collection_name):
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)


def get_collection(mode):
    """
    Get a collection based on the specified mode (ner or pos).

    Args:
        mode (str): The mode for which you want to retrieve the collection ("ner" or "pos").

    Returns:
        pymongo.collection.Collection: The MongoDB collection.
    """
    global mongo_client
    collection_name = "ner_collection" if mode == "ner" else "pos_collection"
    mongo_client = MongoClient(current_app.config["MONGO_URI"]) if mongo_client is None else mongo_client
    db = mongo_client[db_name]
    create_collection_if_not_exists(db, collection_name)
    return db[collection_name]
