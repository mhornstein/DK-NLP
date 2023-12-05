.PHONY: default run install eslint

default: run

run:
	npm start

install:
	npm install

lint: 
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-fix:
	npm run format:fix

test:
	npx ng test --watch=false --browsers=ChromeHeadless

test-cov:
	ng test --code-coverage --watch=false --browsers=ChromeHeadless && start chrome "file:///%CD%/coverage/frontend/index.html"

cov-report:
	ng test --code-coverage --watch=false --browsers=ChromeHeadless