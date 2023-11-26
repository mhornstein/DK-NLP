# Application Deployment Guide - Using Helm and Kubernetes

This README provides detailed instructions for deploying and configuring the DK-NLP application using Helm and Kubernetes.

## Configuration Options

The application supports two configurable options:

1. **Mode**: `dev` Exposes the API while `prod` Does not expose the API. `dev` also enables debugging capabilities which `prod` doesn't. Default: `dev`.

2. **EnableIngress**: Controls whether the app is exposed externally (using Ingress). Default: `false`.

## Deployment Instructions

### Loading the App Without External Exposure

To deploy the app in development mode without external exposure, use the following command:

```shell
helm install dk-nlp ./deployment/helm --set global.mode=dev --set global.enableIngress=false
```

This command is equivalent to the default deployment command:

```shell
helm install dk-nlp ./deployment/helm
```

For production mode, use:

```shell
helm install dk-nlp ./deployment/helm --set global.mode=prod --set global.enableIngress=false
```

#### Accessing Services via Port Forwarding

To access different services, use Kubernetes port forwarding:

- **Tagger Service**:
  ```shell
  kubectl port-forward service/tagger 4000:4000
  ```
  Access: `localhost:4000`

- **DAL Service**:
  ```shell
  kubectl port-forward service/dal 5000:5000
  ```
  Access: `localhost:5000`

- **Server Service**:
  ```shell
  kubectl port-forward service/server 80:80
  ```
  Access: `localhost` or `localhost:80`

In `dev` mode, you can also access the server via the Swagger UI at `localhost/apidocs` (with active port-forwarding).

To stop port-forwarding, use `Ctrl+C` in the command line.

### Loading the App with External Exposure

To expose the app externally, follow these steps:

1. **Get Ingress Controller if wasn't done before** (e.g., NGINX Ingress Controller):
   ```shell
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm repo update
   ```
2. **Set up Ingress Controller**:
   ```shell
   helm install ingress-nginx ingress-nginx/ingress-nginx
   ```

3. **Deploy the App with Ingress Enabled**:
   - For development mode:
     ```shell
     helm install dk-nlp ./deployment/helm --set global.mode=dev --set global.enableIngress=true
     ```
   - For production mode:
     ```shell
     helm install dk-nlp ./deployment/helm --set global.mode=prod --set global.enableIngress=true
     ```

With Ingress enabled, the app is accessible via `localhost`. In `dev` mode, the Swagger UI is available at `localhost/apidocs`.

### Stopping the Application and Ingress Controller

- To stop the DK-NLP app:
  ```shell
  helm uninstall dk-nlp
  ```

- To stop the Ingress Controller:
  ```shell
  helm uninstall ingress-nginx
  ```

**Note**: The Ingress Controller should not be active when loading the app without external exposure.

## Updating the Application

In case you have made changes to the Helm files or wish to modify the configuration, you can use the `upgrade` command. This will update the application according to the changes in the files and flags. For example:

```shell
helm upgrade dk-nlp ./deployment/helm --set global.mode=prod --set global.enableIngress=false
```
