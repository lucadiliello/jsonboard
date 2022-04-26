from distutils.core import setup
import json


with open('version.json') as fi:
    version = json.load(fi)
    version = f"{version['major']}.{version['minor']}.{version['patch']}"


setup(name='JsonBoard',
    version=version,
    description='Data visualization tool based on JSON files.',
    author='Luca Di Liello',
    author_email='luca.diliello@unitn.it',
    url='https://github.com/lucadiliello/jsonboard',
    packages=['jsonboard'],
    scripts=['scripts/jsonboard'],
)
