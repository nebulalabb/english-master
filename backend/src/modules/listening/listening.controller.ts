import { Request, Response, NextFunction } from 'express';
import { ListeningService } from './listening.service';

const listeningService = new ListeningService();

export class ListeningController {
  async getExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const { level, topic } = req.query;
      const exercises = await listeningService.getExercises(level as string, topic as string);
      res.json(exercises);
    } catch (error) {
      next(error);
    }
  }

  async getExerciseById(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await listeningService.getExerciseById(req.params.id as string);
      if (!exercise) {
        return res.status(404).json({ message: 'Listening exercise not found' });
      }
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async submitAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { answers } = req.body; // Array of { questionId, answer }
      const result = await listeningService.submitAnswers(userId, id as string, answers);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
