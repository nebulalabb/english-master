import { Request, Response, NextFunction } from 'express';
import { GrammarService } from './grammar.service';

const grammarService = new GrammarService();

export class GrammarController {
  async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { level } = req.query;
      const topics = await grammarService.getTopics(level as string);
      res.json(topics);
    } catch (error) {
      next(error);
    }
  }

  async getTopicById(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await grammarService.getTopicById(req.params.id as string);
      if (!topic) {
        return res.status(404).json({ message: 'Grammar topic not found' });
      }
      res.json(topic);
    } catch (error) {
      next(error);
    }
  }

  async getExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await grammarService.getExercisesByTopic(req.params.id as string);
      res.json(exercises);
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { exerciseId } = req.params;
      const { answer } = req.body;
      const result = await grammarService.submitAnswer(userId, exerciseId as string, answer as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
