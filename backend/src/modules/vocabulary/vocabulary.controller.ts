import { Request, Response, NextFunction } from 'express';
import { VocabularyService } from './vocabulary.service';

const vocabService = new VocabularyService();

export class VocabularyController {
  async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const topics = await vocabService.getTopics();
      res.json(topics);
    } catch (error) {
      next(error);
    }
  }

  async getWords(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, level, search } = req.query;
      const words = await vocabService.getWords({ 
        topic: topic as string, 
        level: level as string, 
        search: search as string 
      });
      res.json(words);
    } catch (error) {
      next(error);
    }
  }

  async getWordById(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await vocabService.getWordById(req.params.id as string);
      res.json(word);
    } catch (error) {
      next(error);
    }
  }

  async getReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const words = await vocabService.getWordsToReview(userId);
      res.json(words);
    } catch (error) {
      next(error);
    }
  }

  async processReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const wordId = req.params.wordId as string;
      const { quality } = req.body;
      const result = await vocabService.processReview(userId, wordId, Number(quality));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const sets = await vocabService.getSets(userId);
      res.json(sets);
    } catch (error) {
      next(error);
    }
  }

  async createSet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const set = await vocabService.createSet(userId, req.body);
      res.status(201).json(set);
    } catch (error) {
      next(error);
    }
  }

  async updateSet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const set = await vocabService.updateSet(req.params.id as string, userId, req.body);
      res.json(set);
    } catch (error) {
      next(error);
    }
  }

  async deleteSet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await vocabService.deleteSet(req.params.id as string, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addWordToSet(req: Request, res: Response, next: NextFunction) {
    try {
      const { wordId } = req.body;
      const result = await vocabService.addWordToSet(req.params.id as string, wordId as string);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeWordFromSet(req: Request, res: Response, next: NextFunction) {
    try {
      await vocabService.removeWordFromSet(req.params.id as string, req.params.wordId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
