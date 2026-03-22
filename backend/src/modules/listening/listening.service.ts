import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ListeningService {
  async getExercises(level?: string, topic?: string) {
    return prisma.listeningExercise.findMany({
      where: {
        AND: [
          level ? { level } : {},
          topic ? { topic: { contains: topic, mode: 'insensitive' } } : {}
        ]
      },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { questions: true } }
      }
    });
  }

  async getExerciseById(id: string) {
    return prisma.listeningExercise.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async submitAnswers(userId: string, exerciseId: string, answers: { questionId: string, answer: string }[]) {
    const exercise = await prisma.listeningExercise.findUnique({
      where: { id: exerciseId },
      include: { questions: true }
    });

    if (!exercise) throw new Error('Exercise not found');

    const results = [];
    let correctCount = 0;

    for (const sub of answers) {
      const question = exercise.questions.find(q => q.id === sub.questionId);
      if (!question) continue;

      const isCorrect = question.correctAnswer.trim().toLowerCase() === sub.answer.trim().toLowerCase();
      if (isCorrect) correctCount++;

      results.push({
        questionId: sub.questionId,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });

      // Record individual answer
      await prisma.userListeningAnswer.create({
        data: {
          userId,
          questionId: sub.questionId,
          answer: sub.answer,
          isCorrect
        }
      });
    }

    const score = (correctCount / exercise.questions.length) * 100;

    // Update overall progress
    await prisma.userListeningProgress.upsert({
      where: {
        userId_exerciseId: { userId, exerciseId }
      },
      update: {
        status: 'COMPLETED',
        score,
        lastStudied: new Date()
      },
      create: {
        userId,
        exerciseId,
        status: 'COMPLETED',
        score
      }
    });

    return {
      score,
      totalQuestions: exercise.questions.length,
      correctCount,
      results
    };
  }
}
