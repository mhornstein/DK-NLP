install:
	pip install -r requirements.txt
	
format:
	black *.py
	
lint:
	pylint --disable=R,C app
	
test:
	python -m pytest -vv ./tests/
	
run:
	python run.py
	
all: install lint test