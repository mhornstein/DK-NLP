// This is the cluster definition.
// Note that it is "hooked" in the provider.tf to the helm and gcd environment, so helm will know to run in this cluster and not locally

resource "google_container_cluster" "dk_nlp_cluster" {
  name                = "dk-nlp-cluster"
  location            = var.region
  enable_autopilot    = true
  deletion_protection = false
}

// This is the static IP in which the cluster will be exposed with

resource "google_compute_address" "static_ip" {
  name   = "my-static-ip"
  region = var.region
}

// These are the resources in the cluster.
// These resources are deployed using helm configured to point to google_container_cluster.dk_nlp_cluster

resource "helm_release" "nginx_ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"

  set {
    name  = "controller.service.loadBalancerIP"
    value = google_compute_address.static_ip.address
  }
}

resource "helm_release" "dk_nlp" {
  depends_on = [helm_release.nginx_ingress]
  timeout    = 1000  # Timeout in seconds - adjust as needed
  name       = "dk-nlp"
  chart      = "../helm"

  set {
    name  = "global.mode"
    value = var.environment
  }
  set {
    name  = "global.enableIngress"
    value = "true"
  }
  set {
    name  = "frontendBuild.serverUri.base"
    value = google_compute_address.static_ip.address
  }
}

// output to the screen the recieved static IP

output "static_ip_address" {
  value = google_compute_address.static_ip.address
  description = "The static IP address for the ingress controller"
}