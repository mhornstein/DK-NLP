# Deploying the app using Docker Compose

This directory contains the necessary files and instructions for building and launching the app using Docker Compose.

## Development Environment Setup

### Building Docker Images for Development

If you're setting up for the first time or have made new changes, build the Docker images using:

```bash
docker-compose -f deployment/docker-compose/docker-compose.dev.yml build
```

**Note:** The images will be created with a "dev" prefix.

### Running Containers in Detached Mode

To run the containers in the background (detached mode):

```bash
docker-compose -p dev -f deployment/docker-compose/docker-compose.dev.yml up -d
```

**Note:** The containers will be organized under a project named "dev".

### Stopping and Removing Containers

To stop and remove the containers and networks:

```bash
docker-compose -p dev -f deployment/docker-compose/docker-compose.dev.yml down
```

**Important:** Remember to manually remove the volume, especially on Windows systems.

## Production Environment Setup

### Building Docker Images for Production

For production setup, build the Docker images with:

```bash
docker-compose -f deployment/docker-compose/docker-compose.prod.yml build
```

**Note:** The images will be created with a "prod" prefix.

### Running Containers in Detached Mode

To run the containers in the background (detached mode) for production:

```bash
docker-compose -p prod -f deployment/docker-compose/docker-compose.prod.yml up -d
```

**Note:** The containers will be organized under a project named "prod".

### Stopping and Removing Containers

To stop and remove the containers and networks in production:

```bash
docker-compose -p prod -f deployment/docker-compose/docker-compose.prod.yml down
```

**Important:** As with the development setup, remember to manually remove the volume, particularly on Windows systems.

## Additional Resources

- **Docker Images:** You can find the required Docker images (frontend, server, dal and tagger) on [my Docker Hub repository](https://hub.docker.com/u/maorh10).
- **Dockerfiles Location:** The Docker files for each component are located alongside the component code in the designated folder under [/src](https://github.com/mhornstein/DK-NLP/tree/main/src).
