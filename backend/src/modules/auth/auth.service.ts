import prisma from '../../config/prisma';
import redis from '../../config/prisma'; // Wait, I have redis.ts in src/config
// I need to check the redis import path
import redisClient from '../../config/redis';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/auth.utils';
import { AppError } from '../../middleware/error.middleware';
import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import transporter from '../../config/mailer';

export const validate = (schema: ZodObject<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        const err: AppError = new Error(error.errors[0].message);
        err.statusCode = 400;
        next(err);
    }
};

export class AuthService {
  static async register(userData: any) {
    const { email, password, name } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error: AppError = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Redis (expires in 5 mins)
    await redisClient.set(`otp:${email}`, otp, 'EX', 300);

    // Hash password temporarily or keep in memory? 
    // In this flow, we usually wait for OTP before creating user.
    // We can store pending user data in Redis too.
    const hashedPassword = await hashPassword(password);
    await redisClient.set(`pending_user:${email}`, JSON.stringify({ email, password: hashedPassword, name }), 'EX', 600);

    // Send Mail
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your EnglishMaster Account',
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });

    return { message: 'OTP sent to email' };
  }

  static async verifyEmail(email: string, otp: string) {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      const error: AppError = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    const pendingUserJson = await redisClient.get(`pending_user:${email}`);
    if (!pendingUserJson) {
      const error: AppError = new Error('Registration session expired');
      error.statusCode = 400;
      throw error;
    }

    const { password, name } = JSON.parse(pendingUserJson);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password,
        name,
        role: 'USER',
      },
    });

    await redisClient.del(`otp:${email}`);
    await redisClient.del(`pending_user:${email}`);

    return user;
  }

  static async login(credentials: any) {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token) as any;
      const storedToken = await prisma.refreshToken.findFirst({
        where: { userId: decoded.id, token },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
      const accessToken = generateAccessToken(payload);
      
      return { accessToken };
    } catch (error) {
      const err: AppError = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists for security, but we need to stop
      return { message: 'If an account exists, an OTP has been sent' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(`reset_otp:${email}`, otp, 'EX', 300);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Reset your EnglishMaster Password',
      text: `Your password reset OTP is: ${otp}. It expires in 5 minutes.`,
    });

    return { message: 'OTP sent to email' };
  }

  static async resetPassword(data: any) {
    const { email, otp, newPassword } = data;
    const storedOtp = await redisClient.get(`reset_otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      const error: AppError = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    await redisClient.del(`reset_otp:${email}`);
    return { message: 'Password reset successful' };
  }

  static async storeRefreshToken(userId: string, token: string) {
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  static async changePassword(userId: string, data: any) {
    const { oldPassword, newPassword } = data;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.passwordHash) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await comparePassword(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid current password');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
