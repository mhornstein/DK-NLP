from app import *
import argparse
from flasgger import Swagger

def parse_arguments():
    parser = argparse.ArgumentParser(description="Dal Microservice")
    parser.add_argument("--port", type=int, default=5000, help="Port to expose the dal microservice")
    parser.add_argument("--mongo-uri", default="mongodb://localhost:27017", help="MongoDB URI")
    parser.add_argument("--enable-api", action="store_true", help="Enable Swagger API documentation")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()
    app.config["MONGO_URI"] = args.mongo_uri  # Set the MongoDB URI from the command line
    if args.enable_api:
        swagger = Swagger(app, template_file='../docs/api-docs.yaml')
        print(f"Swagger UI is enabled and can be accessed at /apidocs")
    app.run(host='0.0.0.0', port=args.port)
