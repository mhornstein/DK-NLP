// This is the cluster definition.
// Note that it is "hooked" in the provider.tf for the helm environment, so helm will know to run in this cluster and not locally

resource "google_container_cluster" "dk_nlp_cluster" {
  name     = "dk-nlp-cluster"
  location = var.region
  enable_autopilot = true
  deletion_protection = false
}

// These are the resources in the cluster.
// These resources are deployed using helm configured to point to google_container_cluster.dk_nlp_cluster

resource "helm_release" "nginx_ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
}