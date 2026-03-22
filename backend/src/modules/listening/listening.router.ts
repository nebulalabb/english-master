import { Router } from 'express';
import { ListeningController } from './listening.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ListeningController();

router.use(authMiddleware);

router.get('/exercises', controller.getExercises);
router.get('/exercises/:id', controller.getExerciseById);
router.post('/exercises/:id/submit', controller.submitAnswers);

export default router;
