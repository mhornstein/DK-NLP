
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

This will be equivalent to running the frontend as:

```
node scripts/ng_wrapper.js serve
```

### Advanced Usage

For more advanced scenarios, one can use either the `ng` CLI tool or `ng_wrapper`. `ng_wrapper` is a wrapper around the `ng` tool, allowing to pass the same arguments as one would to `ng`. An additional feature of `ng_wrapper` is the ability to specify the server URI with which the client communicates.

For example, to serve the client on port 4300 and set the server URI to `127.0.0.1:3500`, you can run:

```bash
node scripts/ng_wrapper.js serve --port 4300 --serverUri 127.0.0.1:3500
```

Please note that the script needs to be ran from the root folder of the component, i.e. `src/frontend/`.

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
