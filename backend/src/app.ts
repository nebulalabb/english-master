import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';
import logger from './config/logger';
import authRoutes from './modules/auth/auth.routes';
import courseRoutes from './modules/courses/course.routes';
import lessonRoutes from './modules/lessons/lesson.routes';
import vocabRoutes from './modules/vocabulary/vocabulary.router';
import grammarRoutes from './modules/grammar/grammar.router';
import listeningRoutes from './modules/listening/listening.router';
import speakingRoutes from './modules/speaking/speaking.router';
import writingRoutes from './modules/writing/writing.router';
import readingRoutes from './modules/reading/reading.router';
import placementTestRoutes from './modules/placement-test/placement-test.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiLimiter);
// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/vocabulary', vocabRoutes);
app.use('/api/v1/grammar', grammarRoutes);
app.use('/api/v1/listening', listeningRoutes);
app.use('/api/v1/speaking', speakingRoutes);
app.use('/api/v1/writing', writingRoutes);
app.use('/api/v1/reading', readingRoutes);
app.use('/api/v1/placement-test', placementTestRoutes);
app.use('/api/v1', lessonRoutes); // Prefix is already handled inside (units/lessons/exercises)

// Health Check
app.get('/', (req, res) => {
  res.send('EnglishMaster Backend API - Online');
});

// Error handling initialization should be at the end
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Backend listening at http://localhost:${port}`);
});

export default app;
