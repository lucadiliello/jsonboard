import json

import setuptools


with open('version.json') as fi:
    version = json.load(fi)
    version = f"{version['major']}.{version['minor']}.{version['patch']}"


with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()


setuptools.setup(
    name='JsonBoard',
    version=version,
    author='Luca Di Liello',
    author_email='luca.diliello@unitn.it',
    description='Data visualization tool based on JSON files.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    url='https://github.com/lucadiliello/jsonboard',
    project_urls={
        "Bug Tracker": "https://github.com/lucadiliello/jsonboard/issues",
    },
    classifiers=[
        "License :: OSI Approved :: GNU v2 License",
        "Operating System :: OS Independent",
    ],
    packages=['jsonboard'],
    scripts=['scripts/jsonboard'],
)
