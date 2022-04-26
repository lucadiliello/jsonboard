import setuptools

import jsonboard


with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()


with open('requirements.txt') as f:
    requirements = f.readlines()


setuptools.setup(
    name='JsonBoard',
    version=jsonboard.__version__,
    author='Luca Di Liello',
    author_email='luca.diliello@unitn.it',
    description='Data visualization tool based on JSON files.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    url='https://github.com/lucadiliello/jsonboard',
    project_urls={
        "Bug Tracker": "https://github.com/lucadiliello/jsonboard/issues",
    },
    install_requires=requirements,
    scripts=['bin/jsonboard'],
    packages=setuptools.find_packages(exclude=['node_modules', 'public', 'examples']),
    include_package_data=True,
    package_data={
        'client' : ['jsonboard/client/build/*']
    },
)
