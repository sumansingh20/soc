# SOC Academy - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- Docker & Docker Compose installed
- Git installed

### Step 1: Clone & Install
```bash
git clone https://github.com/yourusername/soc-academy.git
cd soc-academy
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

### Step 3: Start Services
```bash
docker-compose up -d
```

### Step 4: Access Platform
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs (when available)

---

## 📚 Project Structure Overview

```
soc-academy/
├── frontend/              # Next.js React app
├── backend/               # Express.js API
├── database/              # Schema and migrations
├── infrastructure/        # Docker, Kubernetes, Nginx configs
├── docs/                  # Documentation
├── scripts/               # Utility scripts
└── docker-compose.yml     # Local dev environment
```

---

## 🛠️ Development Workflow

### Running Locally

**Option 1: Docker Compose (Recommended)**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

**Option 2: Manual Setup**
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Database (if using local postgres/mongo)
# Start PostgreSQL and MongoDB servers
```

### Building for Production
```bash
# Build Docker images
docker-compose build

# Or build individually
docker build -f infrastructure/docker/Dockerfile.backend -t soc-backend:latest backend
docker build -f infrastructure/docker/Dockerfile.frontend -t soc-frontend:latest frontend
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:e2e        # E2E tests with Cypress
```

---

## 📝 Common Tasks

### Add New API Endpoint
1. Create route handler in `backend/routes/`
2. Add model method in `backend/models/`
3. Add validation in middleware
4. Update API docs

### Create New Frontend Page
1. Create folder in `frontend/app/`
2. Add `page.tsx` component
3. Add route to navigation (if needed)
4. Add TypeScript types

### Database Migration
```bash
# Run pending migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Rollback last migration
npm run db:rollback
```

### Add New Course/Lab Data
Edit seed files in `database/seeds/` and run:
```bash
npm run db:seed
```

---

## 🔐 Security Setup

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Enable HTTPS (Local Testing)
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Update nginx.conf with cert paths
```

### Database Security
```bash
# Backup database
npm run db:backup

# Restore from backup
npm run db:restore backup.sql
```

---

## 📊 Monitoring

### View Application Logs
```bash
# Backend logs
docker logs soc-backend -f

# Frontend logs
docker logs soc-frontend -f

# All logs
docker-compose logs -f
```

### Database Queries
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U soc_user -d soc_platform

# View slow queries
docker-compose exec postgres psql -c "SELECT * FROM pg_stat_statements"
```

### Redis Inspection
```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# View keys
KEYS *

# Monitor operations
MONITOR
```

---

## 🚀 Deployment

### Deploy to Kubernetes
```bash
# 1. Build and push images
bash scripts/deploy.sh kubernetes

# 2. Or manually:
docker build -f infrastructure/docker/Dockerfile.backend -t your-registry/soc-backend:latest backend
docker push your-registry/soc-backend:latest

# 3. Deploy
kubectl apply -f infrastructure/kubernetes/k8s-deployment.yaml

# 4. Check status
kubectl get pods -n soc-academy
```

### Deploy to Docker Compose (Production)
```bash
bash scripts/deploy.sh docker-compose
```

### Deploy to AWS/Azure
See [DEPLOYMENT.md](deployment/DEPLOYMENT.md) for detailed instructions.

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Docker Container Fails to Start
```bash
# Check logs
docker logs <container_id>

# Rebuild image
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
docker-compose up -d
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify credentials in .env
cat .env | grep DATABASE
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Verify API URL configuration
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL

# Restart frontend
docker-compose restart frontend
```

---

## 📖 Documentation

- **[API Documentation](../docs/api/API.md)** - Complete API reference
- **[Deployment Guide](../docs/deployment/DEPLOYMENT.md)** - Production deployment
- **[Platform Guide](../docs/PLATFORM_GUIDE.md)** - Features and learning paths
- **[Admin Guide](../docs/ADMIN_GUIDE.md)** - Admin panel operations
- **[Architecture](../docs/ARCHITECTURE.md)** - System design and tech stack
- **[Main README](../README.md)** - Project overview

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -am 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Add tests for new features
- Update documentation

---

## 📊 Key Metrics

Track these metrics to monitor platform health:

### Performance
- Average API response time: < 200ms
- Frontend page load time: < 2s
- Database query time: < 100ms

### Availability
- Uptime: > 99.9%
- Error rate: < 0.1%
- Deployment success rate: > 95%

### User Engagement
- Daily active users
- Course completion rate
- Lab submission rate
- Forum activity

---

## 💡 Tips

1. **Use environment-specific configs**: Always use `.env` for sensitive data
2. **Monitor logs regularly**: Check logs for errors and warnings
3. **Backup databases**: Automated daily backups recommended
4. **Update dependencies**: Run `npm audit` regularly
5. **Test before deploying**: Always test changes locally first
6. **Use Git branches**: Never commit directly to main
7. **Document changes**: Keep documentation updated
8. **Communicate**: Let team know about major changes

---

## 📞 Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/yourusername/soc-academy/issues)
- **Documentation**: Check [docs/](../docs/) folder
- **Email**: support@soc-academy.com
- **Community**: Discord server (if available)

---

## 🎯 Next Steps

1. **Seed Database**: Add courses and labs
2. **Customize Branding**: Update colors and logo
3. **Configure Email**: Set up SendGrid/AWS SES
4. **Setup Payments**: Configure Stripe (if applicable)
5. **Deploy**: Push to staging/production
6. **Monitor**: Set up monitoring and alerts
7. **Iterate**: Gather feedback and improve

---

**Happy developing! 🎓**
