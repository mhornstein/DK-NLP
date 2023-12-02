provider "google" {
  credentials = file(var.gcp_credentials_path)
  project = var.project
  region = var.region
}

data "google_client_config" "default" {}

provider "helm" {
  kubernetes { // The helm provider contains inside the K8s config. See more here: https://registry.terraform.io/providers/hashicorp/helm/latest/docs
    host = google_container_cluster.dk_nlp_cluster.endpoint // this is the cluster declared in main.tf file
    token = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(google_container_cluster.dk_nlp_cluster.master_auth[0].cluster_ca_certificate)
  }
}