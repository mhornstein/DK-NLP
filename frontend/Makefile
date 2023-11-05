.PHONY: default run install eslint

default: run

run:
	npm start

install:
	npm install

# Check code linting. To automatically fix lint issues, run 'npm run lint:fix' (defined in package.json)
lint: 
	npm run lint

# Check code formatting. To automatically fix formatting issues, run 'npm run format:fix' (defined in package.json)
format:
	npm run format

test:
	npx ng test --watch=false --browsers=ChromeHeadless
