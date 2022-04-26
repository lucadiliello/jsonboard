import json
import logging
import os
import re
from typing import Dict, List

from flask import request
from flask_restful import Resource
from json import JSONDecodeError


logger = logging.getLogger(__name__)


def split_path(path: str) -> List[str]:
    r""" Split a path into its various parts. """
    return re.split(f"{os.path.sep}+", path)


def parse_logs(data: Dict):
    r""" Parse and experiment log file and flatten metrics. """
    if 'logs' not in data:
        return data

    data['steps'] = [e['step'] for e in data['logs']]
    other_metrics = set(k for e in data['logs'] for k in e['values'].keys())

    data['logs'] = {
        metric: [
            e['values'][metric] if metric in e['values'] else None
            for e in data['logs']
        ] for metric in other_metrics
    }


def import_data(path: str) -> Dict[str, Dict[str, Dict]]:
    r""" Expects a structure like <experiments_dir>/<experiment_name>/<version>/data.json
    
    Returns:
        A dict mapping experiment names to other dicts mapping metrics to actual values.
    """
    res = dict()

    for root, _, files in os.walk(path, topdown=False):
        for name in files:
            filepath = os.path.join(root, name)
            dirpath, filename = os.path.split(filepath)
            if filename.endswith('.json'):
                dirpath_parts = split_path(dirpath)

                if len(dirpath_parts) >= 2:
                    *_, exp_name, version = dirpath_parts
                elif len(dirpath_parts) == 1:
                    exp_name, version = dirpath_parts[0], 'version_0'
                    logger.warning(f"Didn't find a version for experiment {exp_name}, using 'version_0'.")
                else:
                    exp_name, version = 'default', 'version_0'
                    logger.warning(
                        f"Didn't find a version and experiment name for file {filepath}, using 'default/version_0'."
                    )

                try:
                    with open(filepath) as fi:
                        loaded = json.load(fi)
                    
                    for name in ('metadata', 'logs', 'hparams'):
                        if name not in loaded:
                            logger.warning(
                                f"Experiment {filepath} doesn't have an {name} key so no {name} will be shown."
                            )

                    parse_logs(loaded)
                    final_name = os.path.join(exp_name, version)
                    res[final_name] = loaded
            
                except JSONDecodeError:
                    logger.error(
                        f"Experiment {filepath} could not be parsed correctly, "
                        f"make sure it is valid JSON file. Skipping it."
                    )

    return res


class Data:

    def __init__(self, input_path):
        self.input_path = input_path

    def load_from_disk(self):
        self.logs = import_data(self.input_path)


class DataHandler(Resource):

    data: Data

    def get(self):
        return list(self.data.logs.keys())

    def post(self):
        args = request.get_json()
        name = args['name'] if 'name' in args else None
        metric = args['metric'] if 'metric' in args else None

        res = dict(**self.data.logs)

        # filter on experiment
        if name is not None:
            res = {k: v for k, v in res.items() if k == name}

        # filter on metrics
        if metric is not None:
            for k in res.keys():
                res[k]['logs'] = {m: v for m, v in res[k]['logs'].items() if m == metric}

        return res

    @classmethod
    def create_datafull_class(cls, data: Data):
        cls.data = data
        return cls
