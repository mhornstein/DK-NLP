
[![Frontend CI](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml)


# Angular POS and NER Tagging Application Frontend

## Introduction

This is the frontend component of the Angular-based Part of Speech (POS) and Named Entity Recognition (NER) tagging application. This README provides essential information for setting up, running, testing, and maintaining this Angular app.

The commands attached should be run in the `forntend` directory path of the project.

## Prerequisites

This application was developed using Node.js version 18.16.0.

## Installation

To install the necessary dependencies for the application, run the following command:

```bash
make install
```

This command will use npm to install all required packages.


## Running (and building) the Application

To serve the application, execute the following command in the terminal:

```bash
make run
```

Upon running the command, the client interface will be available on the web browser at the following URL:

```
http://localhost:4200/
```

### Advanced Usage

For additional options regarding the running and building of the client, execute the `lunch.js` script located in the `scripts` directory using Node.js:

**Parameters:**
- `--server-uri` / `-s`: Define the URI of the server to connect to the Angular app (default: "127.0.0.1:3000").
- `--mode` / `-m`: Set the script to either 'serve' for launching the client or 'build' for building the application (default: "serve").
- `--port` / `-p`: Assign the port number for the client when the script mode is 'serve' (default: 4200).

**How to Use:**

Run the script as follows:

```bash
node scripts/lunch.js [options]
```

For instance, to run the client on port 4201 with a different server URI of 12.7.0.0.1:5000, you can use:

```bash
node scripts/lunch.js --server-uri=127.0.0.1:5000 --mode=serve --port=4201
```

**Important Notes:**
- The `--port` option is only applicable when the `--mode` is set to 'serve'.
- If the `--mode` is 'build', the script will ignore the `--port` parameter and will use its default setting.

When the script is executed, it will:
- Parse the command line arguments supplied.
- Update the [environment configuration file](https://github.com/mhornstein/DK-NLP/tree/main/frontend/src/environments) with the provided `server-uri`.
- Run the Angular CLI command that corresponds with the specified `mode`.

## Testing

Testing for this application is done using [Karma](https://karma-runner.github.io/latest/index.html), with the following test coverage:

- Statements: 98.93% (93/94)
- Branches: 100% (20/20)
- Functions: 95.83% (23/24)
- Lines: 98.9% (90/91)

**Note:** The testing process includes continuous integration (CI) using GitHub Actions, which automatically tests the application on both Linux and Windows environments as part of our CI pipeline. The test status is indicated in the badge at the top of this readme file.

To run the tests locally, execute the following command (avaiable only on windows with Chrome installed):

```bash
make test
```

To generate a code coverage report, use the following command:

```bash
make test-cov
```

## Linting

I use [ESLint](https://eslint.org/) for linting. To check the code for linting errors, run the following command:

```bash
make lint
```

If you want to automatically fix some of the linting issues, use the following command:

```bash
make lint-fix
```

## Code Formatting

To validate code format, use the following command:

```bash
make format
```

For automated code formatting, use the following command:

```bash
make format-fix
```

Both commands use the [Prettier library](https://prettier.io/).