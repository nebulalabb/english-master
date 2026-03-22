import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../shared/utils/validate.utils';
import { updateProfileSchema } from './user.schema';
import { upload } from '../../config/cloudinary';

const router = Router();

router.use(authMiddleware);

router.get('/me', UserController.getMe);
router.put('/me', validate(updateProfileSchema), UserController.updateMe);
router.post('/me/avatar', upload.single('avatar'), UserController.uploadAvatar);

router.get('/me/stats', UserController.getStats);
router.get('/me/streak', UserController.getStreak);
router.post('/me/daily-check-in', UserController.dailyCheckIn);

router.get('/me/notifications', UserController.getNotifications);
router.put('/me/notifications/:id/read', UserController.readNotification);

export default router;
