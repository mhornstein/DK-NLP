install:
	pip install -r requirements.txt
	
format:
	black --line-length 110 ./**/*.py
	
lint:
	pylint --disable=R,C ./src
	
test:
	python -m pytest -vv ./tests/

test-cov:
	cd tests && python -m coverage run -m unittest && coverage report && coverage html && cd htmlcov && start chrome "file:///%CD%/tests/htmlcov/index.html" & cd ../..

cov-report:
	cd tests &&  python -m coverage run -m unittest && python -m coverage xml -o coverage-dal.xml

run:
	python src/run.py
	
all: install lint test