import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';

export class CourseService {
  static async getAllCourses(filters: { level?: string; category?: string; isFree?: boolean }) {
    const where: any = {};
    if (filters.level) where.level = filters.level;
    if (filters.category) where.category = filters.category;
    if (filters.isFree !== undefined) where.isFree = filters.isFree;

    return prisma.course.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { units: true }
        }
      }
    });
  }

  static async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        units: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                type: true,
                durationMinutes: true,
                orderIndex: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  static async enroll(userId: string, courseId: string) {
    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    // Check if already enrolled
    const existingEnrollment = await prisma.userCourseEnrollment.findFirst({
      where: { userId, courseId }
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    return prisma.userCourseEnrollment.create({
      data: {
        userId,
        courseId,
        progressPercent: 0
      }
    });
  }

  static async getProgress(userId: string, courseId: string) {
    const enrollment = await prisma.userCourseEnrollment.findFirst({
      where: { userId, courseId }
    });

    if (!enrollment) {
      throw new AppError('Not enrolled in this course', 403);
    }

    // Calculate actual progress based on completed lessons
    const totalLessons = await prisma.lesson.count({
      where: { unit: { courseId } }
    });

    const completedLessons = await prisma.userLessonProgress.count({
      where: {
        userId,
        status: 'COMPLETED',
        lesson: { unit: { courseId } }
      }
    });

    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment progress if changed
    if (progressPercent !== enrollment.progressPercent) {
      await prisma.userCourseEnrollment.update({
        where: { id: enrollment.id },
        data: { progressPercent }
      });
    }

    return {
      progressPercent,
      totalLessons,
      completedLessons
    };
  }

  static async getLearningPath(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const enrolledCourseIds = (await prisma.userCourseEnrollment.findMany({
      where: { userId },
      select: { courseId: true }
    })).map(e => e.courseId);

    // Fetch all courses matching user level
    const courses = await prisma.course.findMany({
      where: {
        level: user.level,
        id: { notIn: enrolledCourseIds }
      },
      include: {
        _count: { select: { units: true } }
      }
    });

    // Score courses based on goals
    const goals = (user.learningGoals as any)?.goals || [];
    const scoredCourses = courses.map(course => {
      let score = 0;
      if (goals.includes(course.category)) score += 10;
      // Add more scoring logic here (e.g., tags, difficulty)
      return { ...course, score };
    });

    return scoredCourses.sort((a, b) => b.score - a.score || a.orderIndex - b.orderIndex).slice(0, 5);
  }

  static async getDailySuggestion(userId: string) {
    // 1. Find active enrollments
    const activeEnrollments = await prisma.userCourseEnrollment.findMany({
      where: { userId },
      orderBy: { lastStudiedAt: 'desc' },
      include: { course: true }
    });

    if (activeEnrollments.length === 0) {
      return null;
    }

    for (const enrollment of activeEnrollments) {
      // 2. Find the first incomplete lesson in this course
      const nextLesson = await prisma.lesson.findFirst({
        where: {
          unit: { courseId: enrollment.courseId },
          userProgress: {
            none: { userId, status: 'COMPLETED' }
          }
        },
        orderBy: [
          { unit: { orderIndex: 'asc' } },
          { orderIndex: 'asc' }
        ],
        include: {
          unit: { select: { title: true } }
        }
      });

      if (nextLesson) {
        return {
          lesson: nextLesson,
          course: enrollment.course,
          reason: 'Next lesson in your current course'
        };
      }
    }

    return null;
  }
}
