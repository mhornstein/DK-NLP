[![Frontend CI](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/frontend-CI.yml) [![Server CI](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/server-CI.yml) [![Dal CI](https://github.com/mhornstein/DK-NLP/actions/workflows/dal-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/dal-CI.yml) [![Tagger CI](https://github.com/mhornstein/DK-NLP/actions/workflows/tagger-CI.yml/badge.svg)](https://github.com/mhornstein/DK-NLP/actions/workflows/tagger-CI.yml)


## Project Overview

This project provides a practical learning experience in deploying and launching machine learning applications. While the core component is a machine learning model, the project's goal is to impart real-world knowledge and best practices in **building and automating software projects**.

The application is composed of 4 microservices:

* **dal:** A Data Access Layer.
* **tagger:** Part-of-speech (POS) and named-entities recognition (NER) tagger.
* **server:** Node server that communicates with the client.
* **frontend:** Angular client.

## Project Stages

1. **Model Training:** The selected model is a text model for POS and NER tagging. Additional details about the model can be found in the [tagging component directory](https://github.com/mhornstein/DK-NLP/tree/main/tagger).
    * **Technologies:** Pytorch
    * **Main Learning Source:**
        * [Deep Learning Methods for Texts and Sequences](https://shoham.biu.ac.il/BiuCoursesViewer/CourseDetails.aspx?lid=748157) course at Bar Ilan University.

2. **Building the End-to-End Application Architecture for Using the Model:** The architecture includes a client-side Angular application, a Node.js server, a Flask microservice exposing the tagging model, and a MongoDB database exposed via a DAL microservice.
    * **Technologies:**
        * Client: Angular
        * Server: Node.js, Express
        * Microservices: Flask
        * Database: MongoDB
    * **Main Learning Source:**
        * [Full Stack Web Development with Angular Specialization](https://www.coursera.org/specializations/full-stack-mobile-app-development)

3. **Implementing Continuous Integration Practices:** Establishing a cycle of testing, linting, and code formatting for every code change.
    * **CI/CD platform:** GitHub Actions
    * **Client Technologies**:
        * Testing: Karma
        * Linting: ESLint
        * Formatting: Prettier
    * **Server Technologies**:
        * Testing: Chai, Mocha, Istanbul
        * Linting and Formatting: ESLint
    * **Microservice Technologies**:
        * Testing: unittest, Pytest
        * Linting: pylint
        * Formatting: Black
    * **Main Learning Sources:**
        * [Cloud Computing Foundations course](https://www.coursera.org/account/accomplishments/certificate/CH4FFC84RHL5)
        * [Angular Unit Testing Made Easy video serie](https://www.youtube.com/watch?v=emnwsVy8wRs)

4. **Exposing an API Using Swagger:** Enabling API exposure for the server and the dal and tagger microservices.

5. **Containerization and Kubernetes Deployment:** Using containers and Kubernetes for component containerization and dependency management.
    * **Main Learning Source:**
        * [Docker Containers and Kubernetes Fundamentals - Full Hands-On Course](https://www.youtube.com/watch?v=kTp5xUtcalw&t=40s)

6. **Cloud Integration:**
    * Initial platform: AWS cloud
    * TBD

## Deployment

TBD

## What Would I Do Differently?

* Reverse the steps and start with the CI process first, followed by Building the Applicable architecture for Using the Model simultaneously, as this approach aligns better with development practices and allows for continuous integration from the beginning. The order I used was chosen for educational purposes, enabling tool-specific learning at each stage.

