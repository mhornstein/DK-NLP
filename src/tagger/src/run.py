import argparse
from flasgger import Swagger
from app import create_app
from waitress import serve


def parse_arguments():
    parser = argparse.ArgumentParser(description="Tagging Microservice")
    parser.add_argument("--port", type=int, default=4000, help="Port to expose the tagging microservice")
    parser.add_argument("--enable-api", action="store_true", help="Enable Swagger API documentation")
    parser.add_argument(
        "--serve",
        default="dev",
        choices=["prod", "dev"],
        help="Serve mode (prod for production, dev for development)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    app = create_app()
    args = parse_arguments()

    if args.enable_api:
        swagger = Swagger(app, template_file="./docs/api-docs.yaml")
        print("Swagger UI is enabled and can be accessed at /apidocs")

    serve_mode = args.serve
    if serve_mode == "prod":
        print(f"Running in production mode on port {args.port}")
        serve(app, host="0.0.0.0", port=args.port)
    else:
        print(f"Running in development mode on port {args.port}")
        app.run(host="0.0.0.0", port=args.port)
