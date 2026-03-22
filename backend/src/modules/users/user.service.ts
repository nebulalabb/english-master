import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        level: true,
        xp: true,
        streak: true,
        lives: true,
        isPremium: true,
        learningGoals: true,
        badges: {
          include: {
            badge: true,
          },
        },
        createdAt: true,
      },
    });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  static async updateProfile(userId: string, updateData: any) {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  static async getStats(userId: string) {
    // Basic stats aggregation
    const completedLessons = await prisma.userLessonProgress.count({
      where: { userId, status: 'COMPLETED' },
    });

    const vocabLearned = await prisma.userVocabProgress.count({
      where: { userId, repetitions: { gt: 0 } },
    });

    // We can add more complex logic for weekly charts later
    return {
      completedLessons,
      vocabLearned,
      studyTimeMinutes: 0, // Placeholder until activity log is implemented
    };
  }

  static async getStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true },
    });
    return user?.streak || 0;
  }

  static async dailyCheckIn(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Logic: Check last_activity_date from StreakRecord
    const lastRecord = await prisma.streakRecord.findFirst({
      where: { userId },
      orderBy: { lastActivityDate: 'desc' },
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let currentStreak = user.streak;
    let earnedXp = 10; // Base XP for check-in

    if (!lastRecord) {
      currentStreak = 1;
      await prisma.streakRecord.create({
        data: { userId, currentStreak: 1, longestStreak: 1, lastActivityDate: today },
      });
    } else {
      const lastDate = new Date(lastRecord.lastActivityDate);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate.getTime() === today.getTime()) {
        // Already checked in today
        return { message: 'Already checked in today', streak: currentStreak, xp: user.xp };
      }

      if (lastDate.getTime() === yesterday.getTime()) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      await prisma.streakRecord.create({
        data: { 
          userId, 
          currentStreak, 
          longestStreak: Math.max(currentStreak, lastRecord.longestStreak),
          lastActivityDate: today 
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streak: currentStreak,
        xp: { increment: earnedXp },
      },
    });

    return { message: 'Check-in successful', streak: currentStreak, xp: updatedUser.xp };
  }

  static async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async markNotificationRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }
}
