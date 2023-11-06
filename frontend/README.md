[![Frontend CI](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml)


# Angular POS and NER Tagging Application Frontend

## Introduction

This is the frontend component of the Angular-based Part of Speech (POS) and Named Entity Recognition (NER) tagging application. This README provides essential information for setting up, running, testing, and maintaining this Angular app.

## Prerequisites

This application was developed using Node.js version 18.16.0.

## Installation

To install the necessary dependencies for the application, run the following command:

```bash
make install
```

This command will use npm to install all required packages.

## Running the Application

To launch the Angular app, use the following command:

```bash
make run
```

The client will be accessible in the browser at `http://localhost:4200/`.

## Testing

Testing for this application is done using Karma, with the following test coverage:

- Statements: 98.93% (93/94)
- Branches: 100% (20/20)
- Functions: 95.83% (23/24)
- Lines: 98.9% (90/91)

**Note:** The testing process includes continuous integration (CI) using GitHub Actions, which automatically tests the application on both Linux and Windows environments as part of our CI pipeline. The test status is indicated in the badge at the top of this readme file.

To run the tests locally, execute the following command:

```bash
make test
```

To generate a code coverage report, use the following command:

```bash
make test-cov
```

## Linting

I use ESLint for linting. To check the code for linting errors, run the following command:

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

Both commands use the Prettier library.
