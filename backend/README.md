Overview

This project is a Vercel-like deployment platform that allows users to log in with their GitHub account and deploy their React projects with a single click. The deployed projects are hosted using AWS services such as S3, ECR, ECS, and Docker. The backend server for GitHub login is running on port 5001, facilitating secure authentication and authorization.
Features

    GitHub Login: Users can securely log in with their GitHub accounts to access the platform.
    One-Click Deployment: Deploy React projects effortlessly with a single click.
    AWS Integration: Utilizes AWS S3, ECR, ECS, and Docker for robust and scalable deployments.
    Deployed URL: After deployment, the user receives a URL to access their live project.

Architecture

    Frontend: React.js with GitHub login integration.
    Backend: Express.js server for handling deployments and GitHub authentication.
    Deployment Services: AWS S3, ECR, ECS, Fargate, Docker.

Setup Guide
Project Structure

This project contains the following services and folders:

    api-server: HTTP API Server for REST APIs.
    uploadFiles3-server: Docker Image code that clones, builds, and pushes the build to S3.
    s3-reverse-proxy: Reverse Proxy for subdomains and domains to S3 bucket static assets.

Local Setup

    Install Dependencies:
        Run npm install in all three services: api-server, uploadFiles3-server, and s3-reverse-proxy.

    Build and Push Docker Image:
        Docker build the uploadFiles3-server and push the image to AWS ECR.

    Configure API Server:
        Set up the api-server by providing all the required configuration, such as TASK ARN and CLUSTER ARN.

    Run the Services:
        Start the api-server and s3-reverse-proxy by running node index.js in each directory.

Running Services

After setup, the following services should be up and running:
S.No	Service	PORT
1	api-server	        :9000
2	socket.io-server	:9002
3	s3-reverse-proxy	:8000
AWS Services Used

    S3: For static file hosting.
    ECR: To store Docker images.
    ECS: To manage and scale Docker containers.
    Fargate: For serverless container management.

Getting Started

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [Docker](https://www.docker.com/get-started)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Git](https://git-scm.com/)

## AWS Setup

To get started with the deployment platform, you need to set up the necessary AWS services. This is done via a bash script that automates the creation of required AWS resources such as S3 bucket, ECR repository, ECS cluster, IAM roles, and more.

### Running the AWS Setup Script

chmod +x aws-setup.sh
./aws-setup.sh