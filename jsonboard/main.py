import logging
from argparse import ArgumentParser

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_restful import Api
from watchdog.observers import Observer

from jsonboard.server.handler import JsonboardHandler
from jsonboard.server.data import Data
from jsonboard.server.server import DataHandler


logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def main():

    parser = ArgumentParser(f"Jsonboard UI server. Run with `jsonboard --input jsonboard/`")
    parser.add_argument('-i', '--input', type=str, required=True, help="Path to jsonboard experiments directory.")
    parser.add_argument('-p', '--port', type=int, default=1337, required=False, help="Server port.")
    parser.add_argument('--data_filename', type=str, default='data.jsonl', help="Name of the data files.")
    parser.add_argument('--hparams_filename', type=str, default='hparams.json', help="Name of the hparams files.")
    parser.add_argument('--meta_filename', type=str, default='meta.json', help="Name of the metadata files.")
    parser.add_argument('--step_field', type=str, default='step', help="Field in the logs that should be used as 'step'.")
    args = parser.parse_args()

    # reading files from folder
    app = Flask(__name__, static_url_path='', static_folder='client/build')
    CORS(app)
    api = Api(app)

    data = Data(args)  # load data from disk
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
