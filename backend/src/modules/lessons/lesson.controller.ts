import { Request, Response, NextFunction } from 'express';
import { LessonService } from './lesson.service';

export class LessonController {
  static async getUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await LessonService.getUnitById(req.params.id as string);
      res.status(200).json(unit);
    } catch (error) {
      next(error);
    }
  }

  static async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.getLessonById(req.params.id as string);
      res.status(200).json(lesson);
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const result = await LessonService.completeLesson(userId, req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await LessonService.getExercisesByLessonId(req.params.id as string);
      res.status(200).json(exercises);
    } catch (error) {
      next(error);
    }
  }

  static async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { answer } = req.body;
      const result = await LessonService.submitExerciseAnswer(userId, req.params.id as string, answer);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
