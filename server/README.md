
[![Server CI](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml)

# Angular POS and NER Tagging Application Server

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

For example, to set the Tagger Service URI to `192.168.1.20:4000`, the DAL Service to `192.168.2.45:5000`, and run the server on port 3001, you can run:

```bash
node ./src/server.js --port=3001 --taggerUri=192.168.1.20:4000 --dalUri=192.168.2.45:5000
```

After running the command with the desired parameters, one should see output in the console indicating that the server is running on the specified port with the configured service URIs.

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


## Linting and Code Formatting

I use [ESLint](https://eslint.org/) for this purpose. To check the code for linting and formatting errors, run the following command:

```bash
make eslint
```

If you want to automatically fix linting and formatting issues, use the following command:

```bash
make eslint-fix
```
