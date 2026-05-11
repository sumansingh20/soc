# HackShield SOC Training Platform

Practical SOC analyst learning portal created by Suman Kumar. The platform combines a Next.js frontend, Express backend, MongoDB data layer, JWT authentication, protected student/admin workflows, quizzes, labs, PDF notes, command practice, search, and progress tracking.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT, bcrypt password hashing, role-based access
- Deployment: Docker, Docker Compose, Vercel-ready frontend

## Local Setup

```bash
npm install
docker compose up -d mongodb
env 'MONGODB_URI=mongodb+srv://sumantech:sumankumar@cluster0.1enfs6w.mongodb.net/' npm run db:seed
env 'MONGODB_URI=mongodb+srv://sumantech:sumankumar@cluster0.1enfs6w.mongodb.net/' npm start -w backend
env NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev -w frontend
```

If port `5000` is already used, start the backend with `API_PORT=5001` and point the frontend at `http://localhost:5001`.

## Seeded Accounts

All seeded accounts use password `student123`.

- Admin: `admin@hackshield.local`
- Instructor: `instructor@hackshield.local`
- Student: `student@hackshield.local`

## Main URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API docs summary: `http://localhost:5000/api-docs`
- Health check: `http://localhost:5000/health`

## Core Features

- Login, register, forgot/reset password, JWT refresh, protected routes
- Role-based admin panel for notes, labs, commands, quizzes, users, and seed content
- Student dashboard with progress, quiz attempts, downloads, tasks, and notifications
- Seven-day SOC learning roadmap
- Linux log analysis for auth.log, syslog, Apache logs, wtmp, and btmp
- Command practice for grep, tail, cat, less, journalctl, last, lastb, ps aux, and netstat
- Practical labs for brute force, failed logins, suspicious login, Apache attack traces, malware process review, SIEM correlation, threat hunting, and incident response
- Connected quizzes with grading and saved progress
- Authenticated PDF note downloads
- Search across lessons, labs, notes, commands, resources, and courses

## Verification

```bash
npm run type-check -w frontend
npm run build
```

The root build runs the production frontend build and a backend syntax build check.

## Docker

```bash
docker compose up --build
```

The compose stack starts MongoDB, Redis, backend, frontend, and Nginx. Update secrets in `docker-compose.yml` or through your deployment environment before production use.

## Deployment Notes

Frontend on Vercel:

- Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- Build command: `npm run build -w frontend`
- Output is handled by Next.js.

Backend:

- Set `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `API_PORT`, and `NODE_ENV`.
- Run `npm start -w backend`.
- Run `npm run db:seed` once for baseline content.
