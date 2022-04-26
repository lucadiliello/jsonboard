import json
import logging
from argparse import ArgumentParser

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_restful import Api
from watchdog.observers import Observer

from server.handler import JsonboardHandler
from server.server import Data, DataHandler

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


with open('version.json') as fi:
    version = json.load(fi)
    version = f"{version['major']}.{version['minor']}.{version['patch']}"


def main():

    parser = ArgumentParser(f"Jsonboard UI server, version {version}. Run with `jsonboard --input jsonboard/`")
    parser.add_argument('-i', '--input', type=str, required=True, help="Path to jsonboard experiments directory.")
    parser.add_argument('-p', '--port', type=int, default=1337, required=False, help="Server port.")
    args = parser.parse_args()

    # reading files from folder
    app = Flask(__name__, static_url_path='', static_folder='client/build')
    CORS(app)
    api = Api(app)

    logger.info("Loading data from disk...")
    data = Data(args.input)  # load data from disk
    data.load_from_disk()

    @app.route("/", defaults={'path': ''})
    def serve(path):
        return send_from_directory(app.static_folder, 'index.html')

    # check for updated in the data folder
    observer = Observer()
    event_handler_class = JsonboardHandler.create_datafull_class(data)()
    observer.schedule(event_handler_class, args.input, recursive=True)
    observer.start()

    api.add_resource(DataHandler.create_datafull_class(data), '/data')
    app.run(port=args.port)

    observer.stop()
    observer.join()


if __name__ == '__main__':
    main()
