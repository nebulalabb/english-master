import { Request, Response, NextFunction } from 'express';
import { ReadingService } from './reading.service';
import axios from 'axios';

const readingService = new ReadingService();

export class ReadingController {
  // ... (previous methods)

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
      const result = await readingService.submitAnswers(userId, id as string, answers);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async lookupVocabulary(req: Request, res: Response, next: NextFunction) {
    try {
      const { word } = req.body;
      if (!word) return res.status(400).json({ message: 'Word is required' });

      // In a real app, we might check a local DB first. 
      // For now, we'll proxy to a public dictionary API or use AI.
      try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        res.json(response.data[0]);
      } catch (err) {
        res.status(404).json({ message: 'Word not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}
