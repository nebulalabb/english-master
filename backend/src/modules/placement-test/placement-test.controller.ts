import { Request, Response, NextFunction } from 'express';
import { PlacementTestService } from './placement-test.service';

export class PlacementTestController {
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await PlacementTestService.getQuestions();
      res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { answers } = req.body;
      const result = await PlacementTestService.submitTest(userId, answers);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
