import { Router } from 'express';
import { WritingController } from './writing.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new WritingController();

router.use(authMiddleware);

router.get('/prompts', controller.getPrompts);
router.get('/prompts/:id', controller.getPromptById);
router.get('/submissions', controller.getSubmissions);
router.get('/submissions/:id', controller.getSubmissionById);
router.post('/prompts/:id/submit', controller.submitWriting);

export default router;
