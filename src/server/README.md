
[![Server CI](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml)

# POS and NER Tagging Application Server

## Introduction

This is the server ([Express](https://expressjs.com/) server) component of the Part of Speech (POS) and Named Entity Recognition (NER) tagging application. This README provides essential information for setting up, running, testing, and maintaining it.

The commands attached should be run in the `server` directory path of the project.

## Prerequisites

This Express server was developed using Node.js version 18.16.0 and Express version 4.18.2 or higher.

## Installation

To install the necessary dependencies for the application, run the following command:

```bash
make install
```

This command will use npm to install all the required packages.

## Running the Server

To launch the server, use the following command:

```bash
make run
```

This will be equivalent to running the server as:

```bash
node ./src/server.js
```

The server will be accessible via `http://localhost:3000/`.
	 

### Advanced Usage

You can customize the server's behavior using the following parameters:

- `-p` or `--port`: Specify the port number on which the server will run (default: 3000).
- `-t` or `--taggerUri`: Set the Tagger Service URI (default: "127.0.0.1:4000").
- `-d` or `--dalUri`: Set the Data Access Layer (DAL) Service URI (default: "127.0.0.1:5000").
- `-e` or `--enable-api`: Toggle the Swagger API documentation on or off. If this flag is set, the server provides access to the Swagger UI at the `/apidocs` endpoint for interactive API documentation.
- `-s` or `--serve-client`: Enable serving of the Angular client. When this flag is set, the server will serve the Angular client from the `dist/frontend` directory. Ensure that you have run `ng build` in the client folder and placed the build output in the server's directory before enabling this option.

For example, to set the Tagger Service URI to `192.168.1.20:4000`, the DAL Service to `192.168.2.45:5000`, run the server on port 3001, with Swagger API enabled, and serve the Angular client, you can run:

```bash
node ./src/server.js --port=3001 --taggerUri=192.168.1.20:4000 --dalUri=192.168.2.45:5000 --enable-api --serve-client
```

After running the command with the desired parameters, the console will display output indicating that the server is running on the specified port with the configured service URIs. If the `--serve-client` flag is enabled, the server will also be serving the Angular client.


## Testing

The testing process uses libraries like [Chai](https://www.chaijs.com/) and [Mocha](https://mochajs.org/). [Istanbul](https://www.npmjs.com/package/istanbul) (nyc) is used for testing the coverage.
The up-to-date coverage is:

- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

**Note:** The testing process includes continuous integration (CI) using GitHub Actions, which automatically tests the application on both Linux and Windows environments as part of our CI pipeline. The test status is indicated in the badge at the top of this readme file.

To run the tests locally, execute the following command:

```bash
make test
```

The Coverage report will be presented at the end of the testing.

To generate a code coverage report and present it intreactively in chrome, use the following command (available only on Windows with Chrome installed):

```bash
make test-cov
```

If you are only interested in creating a coverage report (for instance, as used by Codecov), run the following command:

```bash
make cov-report
```

The report will be generated as an `.info` file located at `.\coverage\Icov.info`.


## Linting and Code Formatting

I use [ESLint](https://eslint.org/) for this purpose. To check the code for linting and formatting errors, run the following command:

```bash
make eslint
```

If you want to automatically fix linting and formatting issues, use the following command:

```bash
make eslint-fix
```
