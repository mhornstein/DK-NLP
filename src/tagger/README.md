[![Tagger CI](https://github.com/mhornstein/DK-NLP/actions/workflows/tagger-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/tagger-CI.yml)

# POS and NER Tagging Application - Tagging Microservice

## Introduction

This microservice is an essential component of the Part of Speech (POS) and Named Entity Recognition (NER) tagging application. It is responsible for performing the tagging process. The microservice uses a pre-trained model, which consists of a 2-layer Bidirectional LSTM (BiLSTM) transducer. For more detailed information about the model and its training, please refer to [this repository](https://github.com/mhornstein/DLTS-3), which contains the complete source code and training data and results under part 3. The configuration employed here is 'c,' which involves using embeddings and subword representation as input to the BiLSTM.

This README serves as a comprehensive guide for setting up, running, testing, and maintaining this microservice.

All the commands provided in this README should be executed from the `tagger` directory within the project.

## Prerequisites

This application has been developed using Python version 3.10.8.

## Installation

To install the necessary dependencies for the application, execute the following command:

```bash
make install
```

This command will use pip to install all the required packages. You can find the list of required packages in the [requirements.txt](https://github.com/mhornstein/DK-NLP/blob/main/tagger/requirements.txt) file.

## Running the Application

To start the microservice, execute the following command:

```bash
make run
```

This will be equivalent to running the application as:

```bash
python run.py
```

The API will be accessible at `http://localhost:4000/`.

### Advanced Usage

You can customize the service's behavior using the following parameters:

- `--port`: Specify the port number on which the service will run (default: `4000`).
- `--enable-api`: Toggle the Swagger API documentation on or off. If this flag is set, the service provides access to the Swagger UI at the `/apidocs` endpoint for interactive API documentation.
- `--serve`: Choose the serve mode (`prod` for production, `dev` for development). Default is `dev`.

For example, to set the port to `4005` with Swagger API enabled, and run in production mode, you can run:

```bash
python run.py --port=4005 --enable-api --serve=prod
```

When running in production mode (`--serve=prod`), the application will be served using Waitress, which is more suitable for production environments. In development mode (`--serve=dev`), Flask's built-in server will be used.

## Testing

Testing for this application is conducted using [unittest](https://docs.python.org/3/library/unittest.html) and [Pytest](https://docs.pytest.org/en/7.4.x/). You can explore the up-to-date code coverage by navigating to the [tagger directory in Codecov](https://app.codecov.io/gh/mhornstein/DK-NLP/tree/main/src%2Ftagger).

**Note:** The testing process also includes continuous integration (CI) using GitHub Actions, which automatically tests the application on both Linux and Windows environments as part of our CI pipeline. The test status is indicated by the badge at the top of this readme file.

To run the tests locally, execute the following command:

```bash
make test
```

To generate and present a code coverage report, use the following command (available only on Windows with Chrome installed):

```bash
make test-cov
```

If you are only interested in creating a coverage report (for instance, as used by Codecov), run the following command:

```bash
make cov-report
```

The report will be generated as an XML file located at `.\tests\coverage-tagger.xml`.

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
