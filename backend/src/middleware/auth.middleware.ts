import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../shared/utils/auth.utils';
import { AppError } from './error.middleware';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as any;
    
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new AppError('Unauthorized', 401));
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token) as any;
      (req as any).user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }
    next();
  } catch (error) {
    next();
  }
};

export const adminMiddleware = roleMiddleware(['ADMIN']);

export const premiumMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  // We should fetch the latest user status from DB or rely on JWT if it's updated
  // For now, let's assume the JWT info is sufficient or check DB
  prisma.user.findUnique({ where: { id: req.user.id } }).then(user => {
    if (!user?.isPremium) {
      return next(new AppError('Premium subscription required', 403));
    }
    next();
  }).catch(next);
};
