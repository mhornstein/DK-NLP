.PHONY: default start test install eslint

default: start

run:
	npm start

test:
	npm test

test-cov:
	npm test & nyc report --reporter=html && start chrome "file:///%CD%/coverage/index.html"

install:
	npm install

eslint:
	npx eslint .

eslint-fix:
	npx eslint . --fix