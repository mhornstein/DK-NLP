.PHONY: default start test install eslint

default: start

run:
	npm start

test:
	npm test

cov-report:
	nyc report --reporter=text

install:
	npm install

eslint:
	npx eslint .

eslint-fix:
	npx eslint . --fix