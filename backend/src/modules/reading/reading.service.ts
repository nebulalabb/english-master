import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReadingService {
  async getPassages(type?: string, level?: string) {
    return prisma.readingPassage.findMany({
      where: {
        AND: [
          type ? { topic: type } : {},
          level ? { level } : {}
        ]
      },
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { id: 'asc' }
    });
  }

  async getPassageById(id: string) {
    return prisma.readingPassage.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async submitAnswers(userId: string, passageId: string, answers: { questionId: string, answer: string }[]) {
    const passage = await prisma.readingPassage.findUnique({
      where: { id: passageId },
      include: { questions: true }
    });

    if (!passage) throw new Error('Passage not found');

    let correctCount = 0;
    const userAnswersData = passage.questions.map(q => {
      const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswer,
        isCorrect
      };
    });

    const score = (correctCount / passage.questions.length) * 100;

    // Save progress
    const progress = await prisma.userReadingProgress.create({
      data: {
        userId,
        passageId,
        score,
        userAnswers: {
          create: userAnswersData
        }
      }
    });

    return {
      score,
      correctCount,
      totalQuestions: passage.questions.length,
      details: userAnswersData
    };
  }
}
