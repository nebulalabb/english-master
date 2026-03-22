import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';

export class CourseController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const level = req.query.level as string | undefined;
      const category = req.query.category as string | undefined;
      const isFree = req.query.isFree;
      
      const filters = {
        level,
        category,
        isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined
      };
      
      const courses = await CourseService.getAllCourses(filters);
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.getCourseById(req.params.id as string);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  static async enroll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const enrollment = await CourseService.enroll(userId, req.params.id as string);
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  static async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const progress = await CourseService.getProgress(userId, req.params.id as string);
      res.status(200).json(progress);
    } catch (error) {
      next(error);
    }
  }

  static async getDailySuggestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const suggestion = await CourseService.getDailySuggestion(userId);
      res.status(200).json(suggestion);
    } catch (error) {
      next(error);
    }
  }

  static async getLearningPath(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const path = await CourseService.getLearningPath(userId);
      res.status(200).json(path);
    } catch (error) {
      next(error);
    }
  }
}
