import { Router } from 'express';
import { LessonController } from './lesson.controller';
import { authMiddleware as protect } from '../../middleware/auth.middleware';

const router = Router();

// Unit routes (can be in its own file or shared here)
router.get('/units/:id', LessonController.getUnit);

// Lesson routes
router.get('/lessons/:id', LessonController.getLesson);
router.post('/lessons/:id/complete', protect, LessonController.complete);
router.get('/lessons/:id/exercises', protect, LessonController.getExercises);
router.post('/exercises/:id/answer', protect, LessonController.submitAnswer);

export default router;
