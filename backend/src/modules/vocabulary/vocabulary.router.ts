import { Router } from 'express';
import { VocabularyController } from './vocabulary.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new VocabularyController();

router.use(authMiddleware);

router.get('/topics', controller.getTopics);
router.get('/words', controller.getWords);
router.get('/words/:id', controller.getWordById);

router.get('/review', controller.getReview);
router.post('/review/:wordId', controller.processReview);

router.get('/sets', controller.getSets);
router.post('/sets', controller.createSet);
router.put('/sets/:id', controller.updateSet);
router.delete('/sets/:id', controller.deleteSet);
router.post('/sets/:id/words', controller.addWordToSet);
router.delete('/sets/:id/words/:wordId', controller.removeWordFromSet);

export default router;
