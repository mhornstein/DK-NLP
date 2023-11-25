## Application Deployment Guide

This section details the procedures for building and launching the application, leveraging Docker, Docker Compose, Kubernetes, and Helm. Each step is designed to cater to different deployment environments and requirements.

### 1. Dockerfile Usage

Each component of the application has a dedicated Dockerfile in its source directory, allowing for independent builds. For example, to build the Data Access Layer (DAL), use the following command:

```bash
docker build -f src/dal/Dockerfile.dal -t dal:latest .
```

This command builds the DAL image with the latest tag.

### 2. Docker Compose Configuration

The `deployment\docker-compose` directory includes two docker-compose.yml files for different deployment modes:

- **Development Mode** - `docker-compose.dev.yaml`: Sets up the application with API exposure and client-side debugging capabilities. This mode is ideal for development and testing.
- **Production Mode** - `docker-compose.prod.yaml`: used for production use. It doesn't offer the API exposure and client-side debugging capabilities.

In both setups, the services are mapped to the following ports:
- Server: Port 3000
- Tagger: Port 4000
- DAL: Port 5000

### 3. Kubernetes Deployment

The Kubernetes configuration in `deployment\kubernetes` is provided for deploying the application in development mode only. 

Here also, the services are mapped to the following ports and can be accessed using port forwarding:
- Server: Port 3000
- Tagger: Port 4000
- DAL: Port 5000

### 4. Helm Chart Integration

Helm (can be found in `deployment\helm`) is used to enhance the Kubernetes configuration, offering greater flexibility and customization: It supports deployment in both development and production modes, as well as external exposure of the app. 

When exposed externally, the server is accessible via port 80 (standard HTTP port), otherwise, it remains on port 3000. The Tagger and DAL services are consistently available on ports 4000 and 5000, respectively.

### Execution Context

Detailed execution guides for each configuration can be found within the README files located in their respective configuration folders. These guides offer step-by-step instructions tailored to each specific setup (Docker Compose, Kubernetes, Helm).

**Important Note:** All commands mentioned in these guides are intended to be executed from the root directory of the project, unless explicitly stated otherwise.
