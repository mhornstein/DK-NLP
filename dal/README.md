
[![Frontend CI](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml)

# POS and NER Tagging Application - Data Access Layer (DAL) Microservice

## Introduction

This microservice is a part of the Part of Speech (POS) and Named Entity Recognition (NER) tagging application. It is responsible for communicating with the database to handle tagging history retrieval and updates.

The microservice assumes the presence of a MongoDB instance, which is expected to be installed and active on the local machine.

If not specified by an `MONGO_URI` environment variable, the microservice assumes that the MongoDB instance is running at `localhost:27017` (for reference, see the [config.py file](https://github.com/mhornstein/DK-NLP/blob/main/dal/app/config.py)).

This README provides a comprehensive guide for setting up, running, testing, and maintaining this microservice. Please ensure that all commands provided in this README are executed from the `dal` directory within the project.

																										

## Prerequisites

This application has been developed using Python version 3.10.8.

## Installation

To install the necessary dependencies for the application, execute the following command:

```bash
make install
```

This command will use pip to install all the required packages. You can find the list of required packages in the [requirements.txt](https://github.com/mhornstein/DK-NLP/blob/main/tagger/requirements.txt) file.

## Running the Application

To launch the microservice, you can use the following command:

```bash
make run
```

This command will start the application with default settings. The API will be accessible at `http://localhost:5000/`, and the MongoDB instance will be reached via `mongodb://localhost:27017`, which is the default configuration for MongoDB.

If you wish to customize the API port or specify a custom MongoDB URI, you can use the following command with the appropriate flags:

```bash
python run.py --port=<custom port> --mongo-uri=<custom MongoDB URI>
```

Replace `<custom port>` with the desired port number for the API and `<custom MongoDB URI>` with the specific URI for the MongoDB instance.

## Testing

Testing for this application is conducted using [unittest](https://docs.python.org/3/library/unittest.html) and [Pytest](https://docs.pytest.org/en/7.4.x/), achieving a test coverage of 98%.

**Note:** The testing process also includes continuous integration (CI) using GitHub Actions, which automatically tests the application on both Linux and Windows environments as part of our CI pipeline. The test status is indicated by the badge at the top of this readme file.

To run the tests locally, execute the following command:

```bash
make test
```

To generate a code coverage report, use the following command (available only on Windows with Chrome installed):

```bash
make test-cov
```

## Linting

I use [pylint](https://pypi.org/project/pylint/) for code linting. To check the code for linting errors, run the following command:

```bash
make lint
```

## Code Formatting

To ensure consistent code formatting, use the following command:

```bash
make format
```

I use [Black](https://pypi.org/project/black/) for code formatting, which helps maintain a uniform coding style.
