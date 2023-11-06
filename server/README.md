
# Angular POS and NER Tagging Application Server

## Introduction

This is the server (Express server) component of the Part of Speech (POS) and Named Entity Recognition (NER) tagging application. This README provides essential information for setting up, running, testing, and maintaining it.

The commands attached should be run in the `server` directory path of the project.

## Prerequisites

This Express server was developed using Node.js version 18.16.0 and Express version 4.18.2 or higher.

## Installation

To install the necessary dependencies for the application, run the following command:

```bash
make install
```

This command will use npm to install all the required packages.

## Running the Application

To launch the server, use the following command:

```bash
make run
```

The server will be accessible via `http://localhost:3000/`.

## Testing

The testing process uses libraries like Chai and Mocha. Istanbul (nyc) is used for testing the coverage.
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

The Coverage report will be presented at the end of the testing. To present it afterwards again, type:

```bash
make cov-report
```

## Linting and Code Formatting

I use ESLint for this purpose. To check the code for linting and formatting errors, run the following command:

```bash
make eslint
```

If you want to automatically fix linting and formatting issues, use the following command:

```bash
make eslint-fix
```
