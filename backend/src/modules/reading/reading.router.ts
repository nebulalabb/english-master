import { Router } from 'express';
import { ReadingController } from './reading.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ReadingController();

router.use(authMiddleware);

router.get('/passages', controller.getPassages);
router.get('/passages/:id', controller.getPassageById);
router.post('/passages/:id/submit', controller.submitAnswers);

export default router;
