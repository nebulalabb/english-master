import { Router } from 'express';
import { CourseController } from './course.controller';
import { authMiddleware as protect } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', CourseController.getAll);
router.get('/daily-suggestion', protect, CourseController.getDailySuggestion);
router.get('/learning-path', protect, CourseController.getLearningPath);
router.get('/:id', CourseController.getById);
router.post('/:id/enroll', protect, CourseController.enroll);
router.get('/:id/progress', protect, CourseController.getProgress);

export default router;
