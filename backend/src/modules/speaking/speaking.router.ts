import { Router } from 'express';
import { SpeakingController } from './speaking.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new SpeakingController();

router.use(authMiddleware);

router.get('/exercises', controller.getExercises);
router.get('/exercises/:id', controller.getExerciseById);
router.get('/history', controller.getHistory);
router.post('/exercises/:id/submit', controller.submitRecording);

export default router;
