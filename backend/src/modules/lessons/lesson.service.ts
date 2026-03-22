import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';

export class LessonService {
  static async getUnitById(id: string) {
    const unit = await prisma.unit.findUnique({
      where: { id },
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
    });
    if (!unit) throw new AppError('Unit not found', 404);
    return unit;
  }

  static async getLessonById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            courseId: true
          }
        }
      }
    });
    if (!lesson) throw new AppError('Lesson not found', 404);
    return lesson;
  }

  static async completeLesson(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { unit: true }
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    // 1. Check if user is enrolled in the course
    const enrollment = await prisma.userCourseEnrollment.findFirst({
      where: { userId, courseId: lesson.unit.courseId }
    });
    if (!enrollment) throw new AppError('Not enrolled in this course', 403);

    // 2. Mark lesson as completed
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        id: (await prisma.userLessonProgress.findFirst({ where: { userId, lessonId } }))?.id || 'temp-id-handled-by-prisma'
      }, // This is tricky with composite keys or non-unique filters in upsert
      // Better use findFirst then create/update
      update: {
        status: 'COMPLETED',
        completedAt: new Date(),
        attempts: { increment: 1 }
      },
      create: {
        userId,
        lessonId,
        status: 'COMPLETED',
        completedAt: new Date(),
        attempts: 1
      }
    });

    // 3. Update lastStudiedAt in enrollment
    await prisma.userCourseEnrollment.updateMany({
      where: { userId, courseId: lesson.unit.courseId },
      data: { lastStudiedAt: new Date() }
    });

    // 4. Award XP to User
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: lesson.xpReward } }
    });

    // 5. Check if unit is >= 80% complete to "unlock" next unit (logically)
    // In our simplified logic, "unlocking" means the next unit's lessons become available
    // or we can create a UserUnitProgress record if we added it (but we didn't add it to schema yet)
    // For now, let's just re-calculate progress and return it.
    const unitLessonsCount = await prisma.lesson.count({ where: { unitId: lesson.unitId } });
    const completedUnitLessonsCount = await prisma.userLessonProgress.count({
      where: { userId, status: 'COMPLETED', lesson: { unitId: lesson.unitId } }
    });
    
    const unitProgressPercent = (completedUnitLessonsCount / unitLessonsCount) * 100;
    const isUnitCompleted = unitProgressPercent >= 80;

    return {
      message: isUnitCompleted ? 'Unit completed & Next unit unlocked!' : 'Lesson completed',
      xpEarned: lesson.xpReward,
      progress,
      unitProgressPercent
    };
  }

  static async getExercisesByLessonId(lessonId: string) {
    return prisma.exercise.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' }
    });
  }

  static async submitExerciseAnswer(userId: string, exerciseId: string, answer: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });
    if (!exercise) throw new AppError('Exercise not found', 404);

    const isCorrect = exercise.correctAnswer.toLowerCase() === answer.toLowerCase();

    const result = await prisma.userExerciseAnswer.create({
      data: {
        userId,
        exerciseId,
        answer,
        isCorrect
      }
    });

    return {
      isCorrect,
      correctAnswer: isCorrect ? undefined : exercise.correctAnswer,
      explanation: exercise.explanation,
      result
    };
  }
}
