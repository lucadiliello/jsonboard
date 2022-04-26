import logging

from watchdog.events import FileSystemEventHandler

from server.server import Data


logger = logging.getLogger(__name__)


class JsonboardHandler(FileSystemEventHandler):

    data: Data

    def on_any_event(self, event):
        if event.is_directory or event.event_type in ('created', 'modified'):
            logger.info("Reloading data from input folder")
            self.data.load_from_disk()

    @classmethod
    def create_datafull_class(cls, data):
        cls.data = data
        return cls
