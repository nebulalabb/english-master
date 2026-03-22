import { Request, Response, NextFunction } from 'express';
import { SpeakingService } from './speaking.service';

const speakingService = new SpeakingService();

export class SpeakingController {
  async getExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, level } = req.query;
      const exercises = await speakingService.getExercises(type as string, level as string);
      res.json(exercises);
    } catch (error) {
      next(error);
    }
  }

  async getExerciseById(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await speakingService.getExerciseById(req.params.id as string);
      if (!exercise) {
        return res.status(404).json({ message: 'Speaking exercise not found' });
      }
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async submitRecording(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const { recognizedText, audioUrl } = req.body;
      const result = await speakingService.submitRecording(userId, id as string, recognizedText, audioUrl);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const history = await speakingService.getHistory(userId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
}
