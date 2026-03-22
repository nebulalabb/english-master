import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class SpeakingService {
  async getExercises(type?: string, level?: string) {
    return prisma.speakingExercise.findMany({
      where: {
        AND: [
          type ? { type } : {},
          level ? { level } : {}
        ]
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async getExerciseById(id: string) {
    return prisma.speakingExercise.findUnique({
      where: { id }
    });
  }

  async submitRecording(userId: string, exerciseId: string, recognizedText: string, audioUrl?: string) {
    const exercise = await prisma.speakingExercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) throw new Error('Exercise not found');

    // Simple scoring logic: compare recognizedText with exercise.targetText
    const target = exercise.targetText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    const recognized = recognizedText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    
    const targetWords = target.split(/\s+/);
    const recognizedWords = recognized.split(/\s+/);
    
    let matchCount = 0;
    const feedback = targetWords.map(word => {
      const isCorrect = recognizedWords.includes(word);
      if (isCorrect) matchCount++;
      return { word, isCorrect };
    });

    const score = Math.round((matchCount / targetWords.length) * 100);

    // Save record
    const record = await prisma.pronunciationRecord.create({
      data: {
        userId,
        exerciseId,
        wordOrSentence: exercise.targetText,
        audioUrl,
        score,
        feedbackJson: { detail: feedback, recognizedText }
      }
    });

    return {
      score,
      feedback,
      recognizedText,
      recordId: record.id
    };
  }

  async getHistory(userId: string) {
    return prisma.pronunciationRecord.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { recordedAt: 'desc' },
      take: 20
    });
  }
}
