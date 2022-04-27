import logging

from flask import request
from flask_restful import Resource

from jsonboard.server.data import Data


logger = logging.getLogger(__name__)


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
