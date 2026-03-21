import { Router } from 'express';

const router = Router();

// Import sub-routers here
// import authRoutes from './auth/auth.routes';

// router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default router;
