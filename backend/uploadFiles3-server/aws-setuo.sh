#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Load AWS CLI configuration
AWS_REGION=$(aws configure get region)
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)


# Define other variables
S3_BUCKET_NAME="your-s3-bucket-name"
ECR_REPO_NAME="your-ecr-repo-name"
CLUSTER_NAME="your-cluster-name"
TASK_DEFINITION_NAME="your-task-name"
IMAGE_TAG="latest

# Create S3 Bucket
echo "Creating S3 bucket..."
aws s3api create-bucket --bucket $S3_BUCKET_NAME --region $AWS_REGION 
echo "S3 bucket '$S3_BUCKET_NAME' created successfully."

# Disable Block Public Access for the S3 Bucket
echo "Disabling Block Public Access for the S3 bucket..."
aws s3api put-public-access-block --bucket $S3_BUCKET_NAME --public-access-block-configuration '{
  "BlockPublicAcls": false,
  "IgnorePublicAcls": false,
  "BlockPublicPolicy": false,
  "RestrictPublicBuckets": false
}'
echo "Block Public Access disabled for S3 bucket '$S3_BUCKET_NAME'."

# Apply Public Access Policy to S3 Bucket
echo "Applying public access policy to S3 bucket..."
aws s3api put-bucket-policy --bucket $S3_BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'$S3_BUCKET_NAME'/*"
    }
  ]
}'
echo "Public access policy applied to S3 bucket '$S3_BUCKET_NAME'."

# Create ECR Repository
echo "Creating ECR repository..."
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION
echo "ECR repository '$ECR_REPO_NAME' created successfully."

# Get ECR login password and log in to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "Logged in to ECR successfully."

# Build Docker image
echo "Building Docker image..."
docker build -t $ECR_REPO_NAME .
echo "Docker image built successfully."

# Tag and push Docker image to ECR
echo "Tagging and pushing Docker image to ECR..."
docker tag $ECR_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
echo "Docker image pushed to ECR successfully."

# Create ECS Cluster
echo "Creating ECS Cluster..."
aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION
echo "ECS Cluster '$CLUSTER_NAME' created successfully."

# Create IAM Role for ECS Tasks using AWS CLI configured role
ROLE_NAME="ecsTaskExecutionRole"
echo "Checking if IAM Role $ROLE_NAME exists..."
if ! aws iam get-role --role-name $ROLE_NAME; then
    echo "Creating IAM Role for ECS Tasks..."
    aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://ecs-trust-policy.json

    aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    echo "IAM Role '$ROLE_NAME' created and policies attached successfully."
else
    echo "IAM Role '$ROLE_NAME' already exists."
fi

# Register ECS Task Definition with the container name as the ECR image name and its URI
echo "Registering ECS Task Definition..."
aws ecs register-task-definition \
    --family $TASK_DEFINITION_NAME \
    --execution-role-arn arn:aws:iam::$AWS_ACCOUNT_ID:role/$ROLE_NAME \
    --container-definitions "[{\"name\":\"$ECR_REPO_NAME\",\"image\":\"$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG\",\"essential\":true,\"memory\":256,\"cpu\":128,\"portMappings\":[{\"containerPort\":80,\"hostPort\":80}]}]" \
    --requires-compatibilities "FARGATE" \
    --network-mode "awsvpc" \
    --memory "512" \
    --cpu "256"
echo "ECS Task Definition '$TASK_DEFINITION_NAME' registered successfully."

# Create Security Group in the default VPC
echo "Creating Security Group in the default VPC..."
DEFAULT_VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name $TASK_DEFINITION_NAME-security-group --description "Security group for ECS task $TASK_DEFINITION_NAME" --vpc-id $DEFAULT_VPC_ID --region $AWS_REGION --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $AWS_REGION
echo "Security Group '$TASK_DEFINITION_NAME-security-group' created successfully."

# Run ECS Task directly using the image without creating an ECS service
echo "Running ECS Task..."
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$DEFAULT_VPC_ID" --query "Subnets[*].SubnetId" --output text | tr '\t' ',')

aws ecs run-task \
    --cluster $CLUSTER_NAME \
    --launch-type "FARGATE" \
    --task-definition $TASK_DEFINITION_NAME \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=ENABLED}" \
    --region $AWS_REGION

echo "ECS Task '$TASK_DEFINITION_NAME' started successfully."

echo "AWS services setup complete."
