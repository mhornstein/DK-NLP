from flask import Flask

from .api.routes import tag_route_blueprint

def create_app():
    app = Flask(__name__)

    app.register_blueprint(tag_route_blueprint)

    return app
