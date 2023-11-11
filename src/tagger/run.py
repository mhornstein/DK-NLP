from app import *
import argparse
from flasgger import Swagger

def parse_arguments():
    parser = argparse.ArgumentParser(description="Tagging Microservice")
    parser.add_argument("--port", type=int, default=4000, help="Port to expose the tagging microservice")
    parser.add_argument("--enable-api", action="store_true", help="Enable Swagger API documentation")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()

    if args.enable_api:
        swagger = Swagger(app, template_file='../swagger/api-docs.yaml')
        print(f"Swagger UI is enabled and can be accessed at /apidocs")

    app.run(host='0.0.0.0', port=args.port)