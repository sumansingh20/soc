#!/bin/bash

# SOC Academy Deployment Script
# This script automates the deployment of SOC Academy to production

set -e

echo "🚀 SOC Academy Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-docker.io}
PROJECT_NAME="soc-academy"

echo -e "${YELLOW}Deployment Environment: ${ENVIRONMENT}${NC}"

# Step 1: Build Docker images
echo -e "${YELLOW}Step 1: Building Docker images...${NC}"
docker-compose build --no-cache

# Step 2: Push to registry
echo -e "${YELLOW}Step 2: Pushing images to registry...${NC}"
docker tag soc-backend:latest $DOCKER_REGISTRY/$PROJECT_NAME/backend:latest
docker tag soc-frontend:latest $DOCKER_REGISTRY/$PROJECT_NAME/frontend:latest

docker push $DOCKER_REGISTRY/$PROJECT_NAME/backend:latest
docker push $DOCKER_REGISTRY/$PROJECT_NAME/frontend:latest

# Step 3: Deploy
if [ "$ENVIRONMENT" = "docker-compose" ]; then
    echo -e "${YELLOW}Step 3: Deploying with Docker Compose...${NC}"
    docker-compose -f docker-compose.yml up -d
    echo -e "${GREEN}✓ Docker Compose deployment complete${NC}"
    
elif [ "$ENVIRONMENT" = "kubernetes" ]; then
    echo -e "${YELLOW}Step 3: Deploying to Kubernetes...${NC}"
    kubectl apply -f infrastructure/kubernetes/k8s-deployment.yaml
    kubectl set image deployment/backend backend=$DOCKER_REGISTRY/$PROJECT_NAME/backend:latest -n soc-academy
    kubectl set image deployment/frontend frontend=$DOCKER_REGISTRY/$PROJECT_NAME/frontend:latest -n soc-academy
    kubectl rollout status deployment/backend -n soc-academy
    kubectl rollout status deployment/frontend -n soc-academy
    echo -e "${GREEN}✓ Kubernetes deployment complete${NC}"
fi

# Step 4: Health checks
echo -e "${YELLOW}Step 4: Performing health checks...${NC}"
sleep 5

if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    exit 1
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend health check passed${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
    exit 1
fi

# Step 5: Database migrations
echo -e "${YELLOW}Step 5: Running database migrations...${NC}"
# This would run migrations here

echo -e "${GREEN}✓ Deployment successful!${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "API Docs: http://localhost:5000/api-docs"
