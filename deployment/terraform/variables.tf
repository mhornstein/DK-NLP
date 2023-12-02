// This file is used to declare variables and optionally provide default values. 
// The actual values will be provided in terraform.tfvars

variable "project" {
  description = "Project name"
}

variable "region" {
  description = "Region for resources"
  default     = "us-central1"
}

variable "gcp_credentials_path" {
  description = "Path to the GCP credentials file"
}

variable "environment" {
  description = "Deployment environment (dev or prod)"
  type = string
}