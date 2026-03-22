import { Router } from 'express';
import { PlacementTestController } from './placement-test.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/questions', PlacementTestController.getQuestions);
router.post('/submit', PlacementTestController.submit);

export default router;
