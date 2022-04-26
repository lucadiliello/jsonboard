import json
import logging
import os
import re
from argparse import Namespace
from json import JSONDecodeError
from typing import Dict, List, Tuple

from flask import request
from flask_restful import Resource


logger = logging.getLogger(__name__)


def split_path(path: str) -> List[str]:
    r""" Split a path into its various parts. """
    return re.split(f"{os.path.sep}+", path)


def parse_logs(data: List[Dict], step_field: str = 'step') -> Tuple[Dict, List]:
    r""" Parse and experiment log file and flatten metrics. """
    other_metrics = set(k for e in data for k in e.keys() if k != step_field)
    steps = [e[step_field] for e in data]
    values = {
        metric: [
            e[metric] if metric in e else None
            for e in data
        ] for metric in other_metrics
    }
    return values, steps


class Data:

    def __init__(self, args: Namespace):
        self.args = args

    def load_from_disk(self):
        self.logs = self.import_data()

    def import_data(self) -> Dict[str, Dict[str, Dict]]:
        r""" Expects a structure like <experiments_dir>/<experiment_name>/<version>/ with the following files:
            - data.jsonl
            - meta.json
            - hparams.json

        Returns:
            A dict mapping mapping data, hparams and meta to their corresponding values.
        """
        results = dict()

        for root, dirnames, _ in os.walk(self.args.input, topdown=False):
            for directory in dirnames:
                dirpath = os.path.join(root, directory)
                dirpath_parts = split_path(dirpath)

                if len(dirpath_parts) >= 2:
                    *_, exp_name, version = dirpath_parts
                elif len(dirpath_parts) == 1:
                    exp_name, version = dirpath_parts[0], 'version_0'
                    logger.warning(f"Didn't find a version for experiment {exp_name}, using 'version_0'.")
                else:
                    exp_name, version = 'default', 'version_0'
                    logger.warning(
                        f"Didn't find a version and experiment name for folder {dirpath}, using 'default/version_0'."
                    )

                try:
                    res = dict()

                    # data
                    data_filename = os.path.join(dirpath, self.args.data_filename)
                    if os.path.isfile(data_filename):
                        with open(data_filename) as fi:
                            res['logs'], res['steps'] = parse_logs([json.loads(line) for line in fi], step_field=self.args.step_field)

                    # hparams
                    hparams_filename = os.path.join(dirpath, self.args.hparams_filename)
                    if os.path.isfile(hparams_filename):
                        with open(hparams_filename) as fi:
                            res['hparams'] = json.load(fi)

                    # hparams
                    meta_filename = os.path.join(dirpath, self.args.meta_filename)
                    if os.path.isfile(meta_filename):
                        with open(meta_filename) as fi:
                            res['metadata'] = json.load(fi)

                    if res:
                        for name in ('meta', 'logs', 'hparams'):
                            if name not in res:
                                logger.warning(
                                    f"Experiment {dirpath} doesn't have an {name} key so no {name} will be shown."
                                )
                        
                        final_name = os.path.join(exp_name, version)
                        results[final_name] = res

                except JSONDecodeError:
                    logger.error(
                        f"Experiment {dirpath} could not be parsed correctly, "
                        f"make sure it is valid JSON file. Skipping it."
                    )

        return results


class DataHandler(Resource):

    data: Data

    def get(self):
        return list(self.data.logs.keys())

    def post(self):
        args = request.get_json()
        name = args['name'] if 'name' in args else None

        # filter on experiment
        if name is not None:
            res = {k: v for k, v in self.data.logs.items() if k == name}
        else:
            res = self.data.logs
        return res

    @classmethod
    def create_datafull_class(cls, data: Data):
        cls.data = data
        return cls
