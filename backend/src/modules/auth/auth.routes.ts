import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/utils/validate.utils';
import { registerSchema, loginSchema, verifyOtpSchema, changePasswordSchema } from './auth.schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/verify-email', validate(verifyOtpSchema), AuthController.verifyEmail);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/change-password', authMiddleware, validate(changePasswordSchema), AuthController.changePassword);

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), AuthController.facebookCallback);

export default router;
