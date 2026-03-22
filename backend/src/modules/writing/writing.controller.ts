import { Request, Response, NextFunction } from 'express';
import { WritingService } from './writing.service';

const writingService = new WritingService();

export class WritingController {
  async getPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, level } = req.query;
      const prompts = await writingService.getPrompts(type as string, level as string);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  async getPromptById(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await writingService.getPromptById(req.params.id as string);
      if (!prompt) {
        return res.status(404).json({ message: 'Writing prompt not found' });
      }
      res.json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async submitWriting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { content } = req.body;
      const result = await writingService.submitWriting(userId, id as string, content);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const submissions = await writingService.getSubmissions(userId);
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await writingService.getSubmissionById(req.params.id as string);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
      res.json(submission);
    } catch (error) {
      next(error);
    }
  }
}
