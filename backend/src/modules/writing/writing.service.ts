import { PrismaClient } from '@prisma/client';
import { analyzeWriting } from '../../lib/gemini';

const prisma = new PrismaClient();

export class WritingService {
  async getPrompts(type?: string, level?: string) {
    return prisma.writingPrompt.findMany({
      where: {
        AND: [
          type ? { type } : {},
          level ? { level } : {}
        ]
      },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async getPromptById(id: string) {
    return prisma.writingPrompt.findUnique({
      where: { id }
    });
  }

  async submitWriting(userId: string, promptId: string, content: string) {
    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: promptId }
    });

    if (!prompt) throw new Error('Writing prompt not found');

    // Call Gemini for analysis
    const analysis = await analyzeWriting(prompt.title + ": " + prompt.requirements, content);

    // Save submission
    const submission = await prisma.aIWritingSubmission.create({
      data: {
        userId,
        promptId,
        content,
        score: analysis.overallScore,
        feedbackJson: analysis
      }
    });

    return {
      submissionId: submission.id,
      ...analysis
    };
  }

  async getSubmissions(userId: string) {
    return prisma.aIWritingSubmission.findMany({
      where: { userId },
      include: { writingPrompt: true },
      orderBy: { submittedAt: 'desc' }
    });
  }

  async getSubmissionById(id: string) {
    return prisma.aIWritingSubmission.findUnique({
      where: { id },
      include: { writingPrompt: true }
    });
  }
}
