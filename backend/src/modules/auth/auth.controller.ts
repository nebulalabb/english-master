import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { generateAccessToken, generateRefreshToken } from '../../shared/utils/auth.utils';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const user = await AuthService.verifyEmail(email, otp);

      // Generate tokens for auto-login
      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Store refresh token
      await AuthService.storeRefreshToken(user.id, refreshToken);

      // Set cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ 
        message: 'Người dùng đã xác thực và đăng nhập', 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompletedPlacementTest: false,
        },
        accessToken 
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken, hasCompletedPlacementTest } = await AuthService.login(req.body);

      // Set cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompletedPlacementTest,
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token missing');
      }
      const { accessToken } = await AuthService.refresh(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'Đã đăng xuất' });
    } catch (error) {
      next(error);
    }
  }

  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await AuthService.storeRefreshToken(user.id, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend with accessToken
      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  }

  static async facebookCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await AuthService.storeRefreshToken(user.id, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await AuthService.changePassword(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
