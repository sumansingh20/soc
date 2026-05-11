import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import config from './config/index.js';
import { connectMongoDB } from './config/mongodb.js';
import logger from './utils/logger.js';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import labRoutes from './routes/labs.js';
import userRoutes from './routes/users.js';
import progressRoutes from './routes/progress.js';
import certificateRoutes from './routes/certificates.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';
import quizRoutes from './routes/quizzes.js';
import notesRoutes from './routes/notes.js';
import resourcesRoutes from './routes/resources.js';
import commandRoutes from './routes/commands.js';
import lessonRoutes from './routes/lessons.js';
import contentRoutes from './routes/content.js';

import datasetRoutes from './routes/datasets.js';
import evidenceRoutes from './routes/evidence.js';
import caseRoutes from './routes/cases.js';
import dashboardBoardsRoutes from './routes/dashboardBoards.js';

import errorHandler from './middleware/errorHandler.js';
import authenticate from './middleware/authenticate.js';


const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(compression());
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg) } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

try {
  await connectMongoDB();
} catch (error) {
  logger.error('Failed to connect to MongoDB:', error);
  process.exit(1);
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/api-docs', (_req, res) => {
  res.json({
    message: 'SOC Academy API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      labs: '/api/labs',
      users: '/api/users',
      progress: '/api/progress',
      certificates: '/api/certificates',
      admin: '/api/admin',
      dashboard: '/api/dashboard',
      quizzes: '/api/quizzes',
      notes: '/api/notes',
      resources: '/api/resources',
      commands: '/api/commands',
      lessons: '/api/lessons',
      content: '/api/content',
      datasets: '/api/datasets',
      evidence: '/api/evidence',
      cases: '/api/cases',
      dashboardBoards: '/api/dashboard/boards',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/progress', authenticate, progressRoutes);
app.use('/api/certificates', authenticate, certificateRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/quizzes', authenticate, quizRoutes);
app.use('/api/notes', authenticate, notesRoutes);
app.use('/api/resources', authenticate, resourcesRoutes);
app.use('/api/commands', authenticate, commandRoutes);
app.use('/api/lessons', authenticate, lessonRoutes);
app.use('/api/content', authenticate, contentRoutes);

app.use('/api/datasets', authenticate, datasetRoutes);
app.use('/api/evidence', authenticate, evidenceRoutes);
app.use('/api/cases', authenticate, caseRoutes);
app.use('/api/dashboard/boards', authenticate, dashboardBoardsRoutes);



app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join-lab', (labId) => {
    socket.join(`lab-${labId}`);
    logger.info(`User joined lab: ${labId}`);
  });

  socket.on('lab-activity', (data) => {
    io.to(`lab-${data.labId}`).emit('activity-update', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

const PORT = config.PORT || 5000;
httpServer.listen(PORT, config.HOST, () => {
  logger.info(`SOC Academy Backend running on http://${config.HOST}:${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, io };
