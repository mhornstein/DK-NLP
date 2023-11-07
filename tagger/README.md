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

To launch the microservice, use the following command:

```bash
make run
```

The API will be accessible at `http://localhost:4000/`.

## Testing

Testing for this application is conducted using [unittest](https://docs.python.org/3/library/unittest.html) and [Pytest](https://docs.pytest.org/en/7.4.x/), achieving a test coverage of 93%.

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
```
