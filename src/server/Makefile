.PHONY: default start test install eslint

default: start

run:
	npm start

test:
	npm test

test-cov:
	npm test & nyc report --reporter=html && start chrome "file:///%CD%/coverage/index.html"

cov-report:
	npm test && npx nyc report --reporter=lcov

install:
	npm install

eslint:
	npx eslint .

eslint-fix:
	npx eslint . --fix