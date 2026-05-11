# SOC Academy Deployment Guide

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (if not using Docker)
- MongoDB 6+ (if not using Docker)
- Redis 7+ (if not using Docker)
- Kubernetes 1.24+ (for K8s deployment)
- kubectl configured
- Git

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/soc-academy.git
cd soc-academy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start development servers
```bash
# Option 1: Using Docker Compose (recommended)
docker-compose up -d

# Option 2: Manual setup
npm run dev
```

### 5. Access the platform
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## Database Setup

### Initialize PostgreSQL
```bash
npm run db:migrate
npm run db:seed
```

### MongoDB Collections
The backend automatically creates MongoDB collections on first run.

## Docker Deployment

### Build images
```bash
docker-compose build
```

### Run containers
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop containers
```bash
docker-compose down
```

## Kubernetes Deployment

### Prerequisites
- kubectl access to K8s cluster
- Docker registry access

### Deploy to cluster
```bash
# 1. Build and push images
docker build -f infrastructure/docker/Dockerfile.backend -t your-registry/soc-backend:latest backend
docker build -f infrastructure/docker/Dockerfile.frontend -t your-registry/soc-frontend:latest frontend

docker push your-registry/soc-backend:latest
docker push your-registry/soc-frontend:latest

# 2. Update image references in k8s-deployment.yaml
# Edit infrastructure/kubernetes/k8s-deployment.yaml with your registry

# 3. Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/k8s-deployment.yaml

# 4. Verify deployment
kubectl get pods -n soc-academy
kubectl get svc -n soc-academy
```

### Check status
```bash
kubectl describe deployment backend -n soc-academy
kubectl logs deployment/backend -n soc-academy
```

## Production Deployment (AWS)

### Using AWS ECS

```bash
# 1. Create ECR repositories
aws ecr create-repository --repository-name soc-backend
aws ecr create-repository --repository-name soc-frontend

# 2. Push images
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag soc-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/soc-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/soc-backend:latest

# 3. Create ECS tasks and services (use AWS Console or CLI)

# 4. Set up RDS for PostgreSQL
# 5. Set up DocumentDB for MongoDB
# 6. Set up ElastiCache for Redis
```

### Using AWS App Runner
```bash
# Deploy directly from GitHub
# Set up GitHub connection in AWS App Runner Console
# Create new service with repository source
```

## Production Deployment (Azure)

### Using Azure Container Apps

```bash
# 1. Create resource group
az group create -n soc-academy-rg -l eastus

# 2. Create Container Registry
az acr create -n socacademyregistry -g soc-academy-rg --sku Basic

# 3. Push images
az acr build -r socacademyregistry -t soc-backend:latest ./backend
az acr build -r socacademyregistry -t soc-frontend:latest ./frontend

# 4. Create Container Apps Environment
az containerapp env create -n soc-academy-env -g soc-academy-rg -l eastus

# 5. Create apps
az containerapp create \
  -n soc-backend \
  -g soc-academy-rg \
  --environment soc-academy-env \
  --image socacademyregistry.azurecr.io/soc-backend:latest

az containerapp create \
  -n soc-frontend \
  -g soc-academy-rg \
  --environment soc-academy-env \
  --image socacademyregistry.azurecr.io/soc-frontend:latest
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# 1. Get certificate
certbot certonly --standalone -d yourdomain.com

# 2. Update nginx.conf with certificate paths
# 3. Reload Nginx
nginx -s reload
```

### Using AWS Certificate Manager
```bash
# 1. Request certificate in ACM Console
# 2. Validate domain
# 3. Attach to ALB
```

## Monitoring & Logging

### Set up application monitoring
- Application Insights (Azure)
- CloudWatch (AWS)
- Datadog/New Relic (Third-party)

### Container logs
```bash
# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs deployment/backend -n soc-academy -f
```

## Database Backup

### PostgreSQL backup
```bash
docker-compose exec postgres pg_dump -U soc_user soc_platform > backup.sql
```

### MongoDB backup
```bash
docker-compose exec mongodb mongodump --out /backup
```

## Scaling

### Horizontal scaling (more replicas)
```bash
# Kubernetes
kubectl scale deployment backend --replicas=5 -n soc-academy

# Docker Compose (not directly supported, use Swarm or K8s)
```

### Load balancing
- Nginx (included in docker-compose)
- AWS ALB (for AWS deployment)
- Azure Application Gateway (for Azure deployment)

## Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database connection issues
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check credentials

### API returning 500 errors
```bash
# Check backend logs
docker-compose logs backend

# Check database migrations ran
npm run db:migrate
```

### Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Verify NEXT_PUBLIC_API_URL is correct
# Check CORS settings in backend
```

## Performance Optimization

### Enable caching
- Redis is configured for session caching
- Configure API response caching

### Database optimization
- Add indexes to frequently queried columns
- Monitor slow queries

### CDN configuration
- Use Cloudflare for static assets
- Configure origin shielding

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set CORS_ORIGIN to production domain
- [ ] Enable rate limiting
- [ ] Set secure JWT_SECRET
- [ ] Enable database encryption
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable audit logging
- [ ] Configure RBAC properly
- [ ] Run security scans

## Maintenance

### Regular backups
- Daily database backups
- Weekly full system backups
- Test restore procedures

### Updates
- Keep dependencies updated
- Security patches immediately
- New features in scheduled maintenance windows

### Monitoring
- Set up alerts for critical errors
- Monitor resource usage
- Track user metrics

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Review troubleshooting guide
3. Contact: support@soc-academy.com
4. GitHub Issues: https://github.com/yourusername/soc-academy/issues
