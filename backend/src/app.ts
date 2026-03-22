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
import apiRoutes from './modules';
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
app.use('/api/v1', apiRoutes);

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
