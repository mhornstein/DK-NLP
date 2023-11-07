from app import *
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description="Dal Microservice")
    parser.add_argument("--port", type=int, default=5000, help="Port to expose the dal microservice")
    parser.add_argument("--mongo-uri", default="mongodb://localhost:27017", help="MongoDB URI")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()
    app.config["MONGO_URI"] = args.mongo_uri  # Set the MongoDB URI from the command line
    app.run(host='0.0.0.0', port=args.port)
