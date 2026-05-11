# SOC Academy - System Architecture

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                         │
│                    (React + Next.js + Zustand)                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS/WSS
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              Nginx Reverse Proxy + Load Balancer                │
│         (SSL/TLS, Rate Limiting, Compression, Caching)         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐┌─────▼──────┐┌────▼──────────┐
│   Frontend   ││  Backend   ││ WebSocket I/O │
│   Service    ││  Service   ││   (Socket.io) │
│  (Next.js)   ││(Express.js)││  Real-time    │
└───────┬──────┘└─────┬──────┘└────┬──────────┘
        │             │            │
        └─────────────┼────────────┘
                      │
        ┌─────────────┼────────────────┐
        │             │                │
┌───────▼──────┐┌────▼──────┐┌───────▼────┐
│ PostgreSQL   ││  MongoDB   ││   Redis    │
│   (Users,    ││  (Content, ││  (Session, │
│   Courses,   ││  Flexible  ││   Cache)   │
│   Progress)  ││  Storage)  ││            │
└──────────────┘└───────────┘└────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Icons**: React Icons
- **UI Components**: Custom + Headless

### Directory Structure
```
frontend/
├── app/                      # Next.js app router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── (auth)/              # Auth routes group
│   │   ├── login/           # Login page
│   │   └── register/        # Register page
│   ├── courses/             # Course routes
│   │   ├── page.tsx         # Course listing
│   │   └── [slug]/          # Course detail
│   ├── labs/                # Lab routes
│   │   ├── page.tsx         # Lab listing
│   │   └── [slug]/          # Lab detail
│   └── dashboard/           # User dashboard
├── components/              # React components
│   ├── Navigation.tsx       # Global navigation
│   ├── Footer.tsx          # Global footer
│   ├── CourseCard.tsx      # Reusable card
│   └── ...
├── lib/                     # Utilities
│   ├── api.ts             # API client
│   ├── store.ts           # Zustand stores
│   └── helpers.ts         # Utilities
├── types/                   # TypeScript types
│   └── index.ts           # All types
├── styles/                  # Global styles
│   └── globals.css        # Tailwind + custom
├── public/                  # Static assets
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json
```

### Component Hierarchy
```
App
├── Layout
│   ├── Navigation
│   ├── {children}
│   │   ├── Page Components
│   │   ├── Modals
│   │   └── Notifications
│   └── Footer
└── Global State (Zustand)
```

---

## Backend Architecture

### Technology Stack
- **Framework**: Express.js 4.18
- **Language**: Node.js 18
- **Databases**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT, bcryptjs, Passport.js
- **Validation**: Express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

### Directory Structure
```
backend/
├── server.js              # Main entry point
├── config/                # Configuration
│   ├── index.js          # Env variables
│   ├── database.js       # PostgreSQL config
│   ├── mongodb.js        # MongoDB config
│   └── redis.js          # Redis config
├── models/                # Database models
│   ├── user.model.js
│   ├── course.model.js
│   └── lab.model.js
├── routes/                # API routes
│   ├── auth.js           # Auth endpoints
│   ├── courses.js        # Course endpoints
│   ├── labs.js           # Lab endpoints
│   ├── users.js          # User endpoints
│   ├── progress.js       # Progress endpoints
│   ├── certificates.js   # Certificate endpoints
│   ├── admin.js          # Admin endpoints
│   └── dashboard.js      # Dashboard endpoints
├── middleware/            # Express middleware
│   ├── authenticate.js   # JWT verification
│   ├── authorize.js      # RBAC
│   └── errorHandler.js   # Error handling
├── services/              # Business logic
│   ├── emailService.js   # Email sending
│   ├── paymentService.js # Payment processing
│   └── analyticsService.js
├── utils/                 # Utilities
│   ├── logger.js         # Winston logger
│   └── validators.js     # Input validation
└── package.json
```

### API Architecture

**Request Flow**:
```
Client Request
    ↓
Nginx (reverse proxy)
    ↓
Express Server
    ↓
Middleware (auth, validate, log)
    ↓
Route Handler
    ↓
Service Layer (business logic)
    ↓
Database Query
    ↓
Response
    ↓
Client
```

### Authentication Flow

```
User Registration/Login
    ↓
Verify credentials
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Client stores token
    ↓
Axios interceptor adds Bearer token to all requests
    ↓
Backend verifies token on protected routes
    ↓
If expired, refresh token endpoint returns new token
```

---

## Database Architecture

### PostgreSQL Schema

**Core Tables:**

1. **users**
   - id (UUID primary key)
   - email (unique, indexed)
   - username (unique)
   - password_hash
   - full_name
   - role (student|instructor|admin)
   - status (active|suspended|banned)
   - created_at, updated_at

2. **courses**
   - id (UUID)
   - title, slug (unique), description
   - difficulty, category
   - duration_hours, price
   - instructor_id (FK to users)
   - status (draft|published)
   - created_at, updated_at

3. **lessons**
   - id (UUID)
   - course_id (FK)
   - title, order
   - content (rich text)
   - video_url, duration_minutes
   - created_at

4. **labs**
   - id (UUID)
   - title, slug, description
   - difficulty, category
   - estimated_time_minutes
   - scenario (JSONB)
   - evaluation_rules (JSONB)
   - created_at

5. **user_progress**
   - id (UUID)
   - user_id (FK), course_id (FK)
   - progress_percentage
   - status (not_started|in_progress|completed)
   - started_at, completed_at
   - Unique constraint: (user_id, course_id)

6. **lab_submissions**
   - id (UUID)
   - user_id (FK), lab_id (FK)
   - findings (JSONB)
   - report (text)
   - score, passed (boolean)
   - submitted_at, evaluated_at
   - Indexed: (user_id, lab_id)

7. **certificates**
   - id (UUID)
   - user_id (FK), course_id (FK)
   - certificate_code (unique)
   - issued_at
   - is_valid

**Secondary Tables:**
- quizzes, quiz_attempts
- challenges, challenge_submissions
- forum_posts, forum_replies
- bookmarks
- audit_logs

### MongoDB Collections (Optional)

- **content**: Dynamic course/lab content
- **announcements**: Platform announcements
- **user_settings**: User preferences
- **analytics_events**: Event tracking

### Redis Keys

- `session:{userId}`: User session data
- `jwt:blacklist:{token}`: Revoked tokens
- `ratelimit:{userId}`: Rate limit counters
- `cache:course:{id}`: Course cache
- `cache:user:{id}`: User data cache

---

## Real-time Architecture

### Socket.io Events

**Client → Server:**
- `lab:join`: User joins lab environment
- `lab:submit`: Lab solution submission
- `chat:message`: Forum message
- `activity:update`: User activity update

**Server → Client:**
- `lab:updated`: Lab status change
- `notification:new`: New notification
- `alert:broadcast`: System-wide alert
- `user:online`: User status update

---

## Security Architecture

### Authentication
- JWT tokens (7-day expiration)
- Refresh tokens (30-day expiration)
- Password hashing with bcryptjs
- OAuth 2.0 for social login

### Authorization
- Role-Based Access Control (RBAC)
- Middleware checks user role before route access
- Resource-level authorization (user can only access own data)

### Data Protection
- HTTPS/TLS for all communications
- CORS configured for frontend origin only
- Rate limiting (100 req/15min per IP)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (Helmet headers)

### Logging & Audit
- All admin actions logged
- Failed login attempts tracked
- User activity timeline
- System events logged

---

## Deployment Architecture

### Local Development
```
Docker Host
├── PostgreSQL container
├── MongoDB container
├── Redis container
├── Backend container
├── Frontend container
└── Nginx container
```

### Kubernetes Cluster
```
K8s Namespace: soc-academy
├── Backend Deployment (3 replicas)
│   └── HPA (2-10 replicas based on CPU/memory)
├── Frontend Deployment (2 replicas)
├── Service: backend-service (LoadBalancer)
├── Service: frontend-service (LoadBalancer)
├── ConfigMap: app-config
└── Secret: app-secrets
```

### Cloud Platforms

**AWS ECS:**
- Backend service on ECS with auto-scaling
- Frontend on S3 + CloudFront
- RDS for PostgreSQL
- DocumentDB for MongoDB
- ElastiCache for Redis

**Azure Container Apps:**
- Backend Container App with auto-scaling
- Frontend Static Web App
- Azure Database for PostgreSQL
- Azure Cosmos DB (MongoDB API)
- Azure Cache for Redis

---

## Performance Optimization

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with Next/Image
- CSS-in-JS with Tailwind (purged unused styles)
- Lazy loading of components and routes
- Service Worker caching

### Backend
- Database connection pooling (Postgres)
- Query optimization with indexes
- Redis caching for frequently accessed data
- Response compression with gzip
- Pagination for large datasets

### Infrastructure
- Nginx caching for static assets
- CDN for static content
- Database backup strategy
- Load balancing across backend replicas

---

## Monitoring & Observability

### Application Monitoring
- Request logging (Morgan middleware)
- Error tracking (Winston logger)
- Performance metrics (response time, requests/sec)
- Real-time alerting

### Database Monitoring
- Query performance tracking
- Connection pool utilization
- Disk usage monitoring
- Backup verification

### Infrastructure Monitoring
- Container health checks
- CPU/memory usage
- Network latency
- Uptime monitoring

---

## Scalability Strategy

### Horizontal Scaling
- Stateless backend allows multiple replicas
- Kubernetes HPA for automatic scaling
- Load balancer distributes requests
- Database connection pooling

### Vertical Scaling
- Increase container resource limits
- Upgrade database instance size
- Increase Redis memory

### Data Scaling
- Database sharding (if needed in future)
- Archive old data
- Optimize indexes
- Partition large tables

---

## Disaster Recovery

### Backup Strategy
- Daily PostgreSQL backups
- Weekly full system backups
- Point-in-time recovery capability
- Backup testing schedule

### High Availability
- Multi-replica backend deployment
- Database replication
- Load balancer health checks
- Auto-recovery on failure

### Incident Response
- Monitoring alerts to ops team
- Runbook for common issues
- Incident tracking and post-mortems
- Regular disaster recovery drills

---

## Technology Decisions

### Why These Technologies?

- **Next.js**: Full-stack React with server-side rendering, optimized deployment
- **Express.js**: Lightweight, flexible, large ecosystem
- **PostgreSQL**: Reliable ACID compliance, perfect for transactional data
- **MongoDB**: Flexible schema for dynamic content, horizontal scalability
- **Redis**: Fast caching layer, session management
- **Tailwind CSS**: Utility-first CSS, rapid UI development
- **Zustand**: Lightweight state management without boilerplate
- **Docker**: Containerization, consistent environments
- **Kubernetes**: Production-grade orchestration, auto-scaling, self-healing

---

## Future Architecture Considerations

- **Microservices**: Split into separate services if needed
- **Event-driven architecture**: Kafka/RabbitMQ for async processing
- **GraphQL**: Consider for complex data queries
- **Server-Sent Events**: For real-time notifications
- **gRPC**: For internal service communication
- **Serverless**: Lambda functions for specific tasks
- **Edge computing**: CDN edge functions for dynamic content

---

**Document Version**: 1.0  
**Last Updated**: May 2026
