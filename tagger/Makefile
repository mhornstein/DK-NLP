install:
	pip install -r requirements.txt
	
format:
	black *.py
	
lint:
	pylint --disable=R,C app
	
test:
	python -m pytest -vv ./tests/

cov-report:
	cd tests && python -m coverage run -m unittest && coverage report && coverage html && cd htmlcov && start chrome "file:///%CD%/tests/htmlcov/index.html" & cd ../..
	
run:
	python run.py
	
all: install lint test