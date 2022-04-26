check:
	isort .
	flake8 .

env:
	pip install -r requirements.txt

clean:
	rm -rf build/ dist/ jsonboard/client/build

all: clean
	cd jsonboard/client && npm run build
	python setup.py sdist bdist_wheel
	twine check dist/*
