check:
	isort .
	flake8 .

env:
	pip install -r requirements.txt

clean:
	rm -rf build/ dist/ jsonboard/client/build

all: clean
	python setup.py sdist bdist_wheel
	twine check dist/*
	cd jsonboard/client && npm run build
