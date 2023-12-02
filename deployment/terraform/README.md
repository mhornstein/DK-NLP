
# DK-NLP Application Deployment Using Terraform and Helm on Google Kubernetes Engine (GKE)

This directory contains a Terraform script designed for the deployment of the DK-NLP application using a Helm chart on Google Cloud's Kubernetes Engine (GKE).

## Deployment Workflow

The script executes the following stages:

1. **Provisioning a Static IP**: Allocates a static IP address for consistent access.
2. **Cluster Deployment**: Initializes and configures a Kubernetes cluster on GKE.
3. **NGINX Ingress Controller Setup**: Deploys an NGINX Ingress Controller within the cluster, binding it to the provisioned static IP.
4. **Application Deployment**: Deploys the DK-NLP application into the cluster, making it accessible via the NGINX Ingress.
5. **Display Access Information**: Outputs the static IP address through which the DK-NLP application can be accessed.

## Prerequisites

Before proceeding with the deployment, ensure the following prerequisites are met:

1. **Google Cloud Account Configuration**: Set up and authenticate your Google Cloud account. Follow the instructions in this [video tutorial](https://www.youtube.com/watch?v=VCayKl82Lt8&t=2645s) up to 08:31 for guidance.
2. **Enable Kubernetes Engine API**: Activate the Kubernetes Engine API in your Google Cloud Console.
3. **Terraform Installation**: Install Terraform. Refer to the [official Terraform documentation](https://www.terraform.io/downloads.html) for installation instructions. You may also use the video tutorial above containing the relevant instructions. 
4. **Add Terraform to  your path**: So it will be available in the console.

## Configuration - The `terraform.tfvars` File

1. **Terraform Variable File**: Update the `terraform.tfvars` file with your GCP configuration details, including the project name, desired region, and path to your GCP credentials JSON file (you can use the [video tutorial](https://www.youtube.com/watch?v=VCayKl82Lt8&t=2645s) mentioned above for more information).
2. **Application Configuration**: Specify the required application mode (`dev` or `prod`) in the `terraform.tfvars` file under the `environment` variable.

## Deployment Instructions

1. Navigate to the `DK-NLP/deployment/terraform` directory in your terminal.
2. Initialize the Terraform environment by executing `terraform init`.
3. Deploy the infrastructure with `terraform apply`. Confirm the action by typing `yes` when prompted.
4. Await the completion of the deployment process. Upon completion, the static URL for accessing the DK-NLP application will be displayed.

## Accessing the Application

- **View the Cluster**: Access the Kubernetes Engine in your Google Cloud Console to view the `dk-nlp-cluster`.
- **Access the Application**: Enter the provided static IP address in your web browser and press Enter.

## Decommissioning

To decommission the application and associated resources:

1. Run `terraform destroy` in the terminal within the  `DK-NLP/deployment/terraform` directory.
2. Confirm the destruction of resources by typing `yes` when prompted.
