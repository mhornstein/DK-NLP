# Kubernetes Deployment Guide

This directory contains the Kubernetes (k8s) configuration files for deploying the application using the Kubernetes technology.

Initially created as a learning resource to understand Kubernetes, this directory has evolved to be managed through Helm later on.

Therefore, here the focus is on deploying the app in development mode only, using Docker Decktop.
For enhancements such as production mode or application exposure, use the [Helm directory](https://github.com/mhornstein/DK-NLP/tree/main/deployment/helm).


## Docker Images

The Docker images used in these configurations are hosted on [my Docker Hub repository](https://hub.docker.com/u/maorh10).

## Deployment Instructions

To deploy the application using Kubernetes, use the [K8s Dev Cheat Sheet](https://github.com/mhornstein/DK-NLP/blob/main/deployment/kubernetes/K8s%20Dev%20Cheat%20Sheet.md). It contains comprehensive instructions as well as personal notes on useful insights I've gathered.

## Important Note: Docker Desktop-Specific Configuration

This configuration uses a [Persistent Volume Claim with "ReadWriteMany" access](https://github.com/mhornstein/DK-NLP/blob/main/deployment/kubernetes/storage/persistentvolumeclaims/angular-dist-pvc.yaml), suitable for Docker Desktop environments. This approach is **not compatible** with cloud-based Kubernetes services.

For Cloud Deployments, Please refer to the accompanying Helm configuration. It circumvents shared memory limitations by integrating the client build into the server's container initialization process, ensuring compatibility with cloud Kubernetes environments.
