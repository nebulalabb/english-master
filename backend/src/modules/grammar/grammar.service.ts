import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class GrammarService {
  async getTopics(level?: string) {
    return prisma.grammarTopic.findMany({
      where: level ? { level } : {},
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { exercises: true } }
      }
    });
  }

  async getTopicById(id: string) {
    return prisma.grammarTopic.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async getExercisesByTopic(topicId: string) {
    return prisma.grammarExercise.findMany({
      where: { topicId },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async submitAnswer(userId: string, exerciseId: string, answer: string) {
    const exercise = await prisma.grammarExercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    const isCorrect = exercise.correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase();

    // Record answer
    await prisma.userGrammarAnswer.create({
      data: {
        userId,
        exerciseId,
        answer,
        isCorrect
      }
    });

    // Update progress
    await prisma.userGrammarProgress.upsert({
      where: {
        userId_topicId: { userId, topicId: exercise.topicId }
      },
      update: {
        status: 'IN_PROGRESS',
        lastStudied: new Date()
      },
      create: {
        userId,
        topicId: exercise.topicId,
        status: 'IN_PROGRESS'
      }
    });

    return {
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation
    };
  }

  async updateProgress(userId: string, topicId: string, status: string) {
    return prisma.userGrammarProgress.upsert({
      where: {
        userId_topicId: { userId, topicId }
      },
      update: { status, lastStudied: new Date() },
      create: { userId, topicId, status }
    });
  }
}
