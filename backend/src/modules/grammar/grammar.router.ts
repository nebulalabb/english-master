import { Router } from 'express';
import { GrammarController } from './grammar.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new GrammarController();

router.use(authMiddleware);

router.get('/topics', controller.getTopics);
router.get('/topics/:id', controller.getTopicById);
router.get('/topics/:id/exercises', controller.getExercises);
router.post('/exercises/:exerciseId/answer', controller.submitAnswer);

export default router;
