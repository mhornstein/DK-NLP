
# K8s Cheat Sheet

The commands in this file should be executed via `kubectl`, assuming you are in the `/DK-NLP/deployment/kubernetes` path. 

At the end of this file, general-purpose usable K8s commands are attached.

## Load Commands

To load the entire system, run the following commands in this order:

### Load Mongo Microservice

```bash
kubectl apply -f databases/mongo/statefulset.yml
kubectl apply -f databases/mongo/service.yaml
```

### Load DAL Microservice (That interacts with the Mongo DB)

```bash
kubectl apply -f dal/deployment.yaml
kubectl apply -f dal/service.yaml
```

### Load Tagger Microservice

```bash
kubectl apply -f tagger/deployment.yaml
kubectl apply -f tagger/service.yaml
```

### Build the Frontend

```bash
kubectl apply -f storage/persistentvolumeclaims/angular-dist-pvc.yaml
kubectl apply -f frontend/frontend-build-job.yaml
```

### Load the Server

```bash
kubectl apply -f server/deployment.yaml
kubectl apply -f server/service.yaml
```

## Ports Forwarding

To reach the services via localhost for testing, run the relevant port-forward command:

- For tagger: `kubectl port-forward service/tagger 4000:4000`
- For dal: `kubectl port-forward service/dal 5000:5000`
- For server: `kubectl port-forward service/server 3000:3000`

Use `Ctrl+C` to terminate.

## Delete Commands

To turn off the entire system and free its resources, run the following commands in this order:

### Delete Mongo Microservice

```bash
kubectl delete -f databases/mongo/statefulset.yml
kubectl delete -f databases/mongo/service.yaml
```

### Delete DAL Microservice

```bash
kubectl delete -f dal/deployment.yaml
kubectl delete -f dal/service.yaml
```

### Delete Tagger Microservice

```bash
kubectl delete -f tagger/deployment.yaml
kubectl delete -f tagger/service.yaml
```

### Delete the Frontend

```bash
kubectl delete -f frontend/frontend-build-job.yaml
```

### Delete the Server

```bash
kubectl delete -f server/deployment.yaml
kubectl delete -f server/service.yaml
kubectl delete -f storage/persistentvolumeclaims/angular-dist-pvc.yaml
```

---

## General-purpose Useful Commands

### Build an Image

For example, to build the dal image, naming it "dal-image" with "latest" tag, run (from the project root):

```bash
docker build -f src/dal/Dockerfile.dal -t dal:latest .
```

### Push Images to Dockerhub

For example, to push the dal image, first build it and name it "dal-image" as explained above.
Then, run:

```bash
docker login
docker tag dal-image maorh10/dal:latest
docker push maorh10/dal:latest
```

### Displaying Pods

```bash
kubectl get pods
```

One can also get pods with a certain tag using: `kubectl get pods -l app=<label>`
e.g., `kubectl get pods -l app=tagger`

### Pod Summary

```bash
kubectl get pods # to get the pods
kubectl describe pods <pod-name>
```

### Pods Logs

```bash
kubectl get pods # to get the pods
kubectl logs <pod-name>
```

Pod's logs can also be browsed via Docker Desktop UI.

### SSH to pod

```bash
kubectl get pods # to get the pods
kubectl exec -it [POD_NAME] -- /bin/sh
```
