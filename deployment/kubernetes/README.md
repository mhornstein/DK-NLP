
# Kubernetes Service Deployment Guide

This guide outlines basic steps for deploying, managing, and testing the project's services within a Kubernetes environment.

## Prerequisites

- A functioning Kubernetes cluster (I use Docker Desktop with Kubernetes enabled).
- The `kubectl` command-line tool installed and configured.

## Deployment Process

### Launching Services

To deploy a service, navigate to the directory containing the Kubernetes YAML configuration files and execute:

```bash
kubectl apply -f <filename or directory>
```

For instance, to deploy the `tagger` service, navigate to `DK-NLP/deployment/kubernetes/tagger/` and run:

```bash
kubectl apply -f .
```

Alternatively, deploy from the project's root directory:

```bash
kubectl apply -f ./deployment/kubernetes/tagger
```

### Monitoring Services

1. **Listing Pods:**

   To view all pods associated with a specific service, use the label selector:

   ```bash
   kubectl get pods -l app=<label>
   ```

   Replace `<label>` with the label specified in the service's YAML file. For example, for the `tagger` service:

   ```bash
   kubectl get pods -l app=tagger
   ```

2. **Accessing Pod Logs:**

   After identifying the pod's name using the previous command, retrieve its logs with:

   ```bash
   kubectl logs <pod-name>
   ```
   The pod's logs can be also browsed via Docker Desktop UI.

### Removing Services

To terminate and remove all resources related to a specific service, execute:

```bash
kubectl delete -f <filename or directory>
```

This will remove all Kubernetes resources defined in the specified file or directory.

## Local Testing

For local testing use *Port Forwarding*: map a local port to a service's port:

```bash
kubectl port-forward service/<service-name> <local-port>:<service-port>
```

For example, to forward local port 4000 to the `tagger` service's port 4000:

```bash
kubectl port-forward service/tagger 4000:4000
```

Access the service via `http://localhost:4000`. To cease port forwarding, use `Ctrl+C` in the terminal.
