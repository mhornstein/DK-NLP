from app import *
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description="Tagging Microservice")
    parser.add_argument("--port", type=int, default=4000, help="Port to expose the tagging microservice")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()
    app.run(host='0.0.0.0', port=args.port)