import configargparse
from flask import Flask
from .api.routes import api_blueprint


def create_app():
    parser = configargparse.ArgParser(description="Dal Microservice")
    parser.add("--port", env_var="PORT", type=int, default=5000, help="Port to expose the dal microservice")
    parser.add("--mongo-uri", env_var="MONGO_URI", default="mongodb://localhost:27017", help="MongoDB URI")
    parser.add(
        "--enable-api",
        env_var="ENABLE_API",
        default=False,
        action="store_true",
        help="Enable Swagger API documentation",
    )
    args = parser.parse_args()

    app = Flask(__name__)

    app.config["MONGO_URI"] = args.mongo_uri
    app.config["PORT"] = args.port
    print(f"Connecting to MongoDB instance in: {args.mongo_uri}")

    if args.enable_api:
        from flasgger import Swagger

        _ = Swagger(app, template_file="./docs/api-docs.yaml")
        print("Swagger UI is enabled and can be accessed at /apidocs")

    app.register_blueprint(api_blueprint)

    return app
