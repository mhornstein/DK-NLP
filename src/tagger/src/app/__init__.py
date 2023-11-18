import configargparse
from flask import Flask
from .api.routes import api_blueprint


def create_app():
    parser = configargparse.ArgParser(description="Tagging Microservice")
    parser.add(
        "--port", env_var="PORT", type=int, default=4000, help="Port to expose the tagging microservice"
    )
    parser.add(
        "--enable-api",
        env_var="ENABLE_API",
        default=False,
        action="store_true",
        help="Enable Swagger API documentation",
    )
    args = parser.parse_args()

    app = Flask(__name__)

    app.config["PORT"] = args.port

    if args.enable_api:
        from flasgger import Swagger

        _ = Swagger(app, template_file="./docs/api-docs.yaml")
        print("Swagger UI is enabled and can be accessed at /apidocs")

    app.register_blueprint(api_blueprint)

    return app
