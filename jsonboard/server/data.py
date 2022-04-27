import json
import logging
import os
import re
from argparse import Namespace
from json import JSONDecodeError
from typing import Callable, Dict, List, Tuple

import numpy as np
from p_tqdm import p_map


logger = logging.getLogger(__name__)
MAX_LENGTH = 201


def split_path(path: str) -> List[str]:
    r""" Split a path into its various parts. """
    return re.split(f"{os.path.sep}+", path)


def merge_states(states: List[Dict], reduce_fn: Callable = np.mean) -> Dict:
    r""" Merge many states into a single one. """
    return {k: reduce_fn([state[k] for state in states]) for k in states[0].keys()}


def collapse_logs(data: List[Dict], max_length: int = 100, reduce_fn: Callable = np.mean):
    r""" Collapse a list of undefined length to a list of fixed len by merging states. """
    parts = np.array_split(data, max_length)
    res = [merge_states(part, reduce_fn=reduce_fn) for part in parts]
    for r in res:
        r['step'] = int(r['step'])
    return res


def parse_logs(data: List[Dict], step_field: str = 'step') -> Tuple[Dict, List]:
    r""" Parse and experiment log file and flatten metrics. """
    all_metrics = set()

    # fix step field
    for d in data:
        if step_field != 'step':
            d['step'] = d.pop(step_field)
        all_metrics.update(d.keys())

    # json cannot parse sets
    all_metrics.remove('step')
    all_metrics = list(all_metrics)

    # clean from junk
    data = [d for d in data if 'step' in d]

    # sort on step field
    data.sort(key=lambda a: a['step'])

    if len(data) > MAX_LENGTH:
        data = collapse_logs(data, max_length=MAX_LENGTH)

    return data, all_metrics


def parse_folder(_inputs):
    r""" Parse and reduce the logs in that folder. """
    dirpath, data_filename, hparams_filename, meta_filename, final_name, step_field = _inputs

    try:
        res = dict()

        # data
        if os.path.isfile(data_filename):
            with open(data_filename) as fi:
                res['logs'], res['metrics'] = parse_logs([json.loads(line) for line in fi], step_field=step_field)

        # hparams
        if os.path.isfile(hparams_filename):
            with open(hparams_filename) as fi:
                res['hparams'] = json.load(fi)

        # meta
        if os.path.isfile(meta_filename):
            with open(meta_filename) as fi:
                res['meta'] = json.load(fi)

        if res:
            for name in ('meta', 'logs', 'hparams'):
                if name not in res:
                    logger.warning(
                        f"Experiment {dirpath} doesn't have an {name} key so no {name} will be shown."
                    )

    except JSONDecodeError:
        logger.error(
            f"Experiment {dirpath} could not be parsed correctly, "
            f"make sure it is valid JSON file. Skipping it."
        )

    return {final_name: res} if res else None


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
        results = []

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

                data_filename = os.path.join(dirpath, self.args.data_filename)
                hparams_filename = os.path.join(dirpath, self.args.hparams_filename)
                meta_filename = os.path.join(dirpath, self.args.meta_filename)
                final_name = os.path.join(exp_name, version)

                results.append(
                    (dirpath, data_filename, hparams_filename, meta_filename, final_name, self.args.step_field)
                )

        res = [r for r in p_map(parse_folder, results, num_cpus=8) if r is not None]
        return {k: v for r in res for k, v in r.items()}
