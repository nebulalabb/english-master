import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class VocabularyService {
  async getTopics() {
    const topics = await prisma.vocabWord.findMany({
      distinct: ['topic'],
      select: { topic: true },
    });
    return topics.map(t => t.topic);
  }

  async getWords(filters: { topic?: string; level?: string; search?: string }) {
    return prisma.vocabWord.findMany({
      where: {
        AND: [
          filters.topic ? { topic: filters.topic } : {},
          filters.level ? { level: filters.level } : {},
          filters.search ? {
            OR: [
              { word: { contains: filters.search, mode: 'insensitive' } },
              { definition: { contains: filters.search, mode: 'insensitive' } },
            ]
          } : {},
        ],
      },
    });
  }

  async getWordById(id: string) {
    return prisma.vocabWord.findUnique({
      where: { id },
    });
  }

  async getWordsToReview(userId: string) {
    const now = new Date();
    return prisma.userVocabProgress.findMany({
      where: {
        userId,
        nextReview: { lte: now },
      },
      include: { word: true },
    });
  }

  async processReview(userId: string, wordId: string, quality: number) {
    // SM-2 Algorithm Implementation
    // quality: 0-5
    // 0: Complete blackout.
    // 1: Incorrect response; the correct one remembered.
    // 2: Incorrect response; where the correct one seemed easy to recall.
    // 3: Correct response; recalled with serious difficulty.
    // 4: Correct response; after a hesitation.
    // 5: Perfect response.

    let progress = await prisma.userVocabProgress.findUnique({
      where: {
        userId_wordId: { userId, wordId },
      },
    });

    if (!progress) {
      progress = await prisma.userVocabProgress.create({
        data: {
          userId,
          wordId,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReview: new Date(),
        },
      });
    }

    let { easeFactor, interval, repetitions } = progress;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
      
      // Calculate EF: EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;
    } else {
      repetitions = 0;
      interval = 1;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return prisma.userVocabProgress.update({
      where: { id: progress.id },
      data: {
        easeFactor,
        interval,
        repetitions,
        nextReview,
      },
    });
  }

  async getSets(userId: string) {
    return prisma.vocabSet.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: true },
        ],
      },
      include: {
        _count: { select: { setWords: true } },
      },
    });
  }

  async createSet(userId: string, data: { title: string; description?: string; isPublic?: boolean }) {
    return prisma.vocabSet.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateSet(setId: string, userId: string, data: { title?: string; description?: string; isPublic?: boolean }) {
    return prisma.vocabSet.update({
      where: { id: setId, userId },
      data,
    });
  }

  async deleteSet(setId: string, userId: string) {
    return prisma.vocabSet.delete({
      where: { id: setId, userId },
    });
  }

  async addWordToSet(setId: string, wordId: string) {
    const lastWord = await prisma.vocabSetWord.findFirst({
      where: { setId },
      orderBy: { orderIndex: 'desc' },
    });
    const orderIndex = (lastWord?.orderIndex || 0) + 1;

    return prisma.vocabSetWord.create({
      data: {
        setId,
        wordId,
        orderIndex,
      },
    });
  }

  async removeWordFromSet(setId: string, wordId: string) {
    return prisma.vocabSetWord.deleteMany({
      where: { setId, wordId },
    });
  }
}
