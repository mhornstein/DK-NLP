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
	ng test --no-watch --code-coverage