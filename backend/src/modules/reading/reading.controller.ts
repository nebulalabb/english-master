import { Request, Response, NextFunction } from 'express';
import { ReadingService } from './reading.service';

const readingService = new ReadingService();

export class ReadingController {
  async getPassages(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, level } = req.query;
      const passages = await readingService.getPassages(topic as string, level as string);
      res.json(passages);
    } catch (error) {
      next(error);
    }
  }

  async getPassageById(req: Request, res: Response, next: NextFunction) {
    try {
      const passage = await readingService.getPassageById(req.params.id as string);
      if (!passage) {
        return res.status(404).json({ message: 'Reading passage not found' });
      }
      res.json(passage);
    } catch (error) {
      next(error);
    }
  }

  async submitAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { answers } = req.body;
      const result = await readingService.submitAnswers(userId, id, answers);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
