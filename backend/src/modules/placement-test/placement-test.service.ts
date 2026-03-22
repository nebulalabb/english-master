import prisma from '../../config/prisma';

export class PlacementTestService {
  static async getQuestions() {
    // In a real app, we might fetch from ExamQuestion with a specific type
    // or a predefined list for placement.
    // For now, let's fetch any 40 questions or mock them.
    return await prisma.examQuestion.findMany({
      take: 40,
      orderBy: { orderIndex: 'asc' },
    });
  }

  static async submitTest(userId: string, answers: { questionId: string, answer: string }[]) {
    let correctCount = 0;
    const totalQuestions = answers.length;

    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: answers.map(a => a.questionId) } },
    });

    const results = answers.map(ans => {
      const question = questions.find(q => q.id === ans.questionId);
      const isCorrect = question?.correctAnswer === ans.answer;
      if (isCorrect) correctCount++;
      return {
        questionId: ans.questionId,
        userAnswer: ans.answer,
        isCorrect,
      };
    });

    const scorePercent = (correctCount / totalQuestions) * 100;
    let level = 'Beginner';

    if (scorePercent > 80) level = 'Advanced';
    else if (scorePercent > 60) level = 'Upper-Intermediate';
    else if (scorePercent > 40) level = 'Intermediate';
    else if (scorePercent > 20) level = 'Elementary';

    // Update user level
    await prisma.user.update({
      where: { id: userId },
      data: { level },
    });

    // Create placement test record
    await prisma.placementTest.create({
      data: {
        userId,
        score: Math.round(scorePercent),
        levelResult: level,
      },
    });

    return { score: scorePercent, level, results };
  }
}
