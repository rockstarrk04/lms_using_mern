import express from 'express';
import {
  updateLesson,
  deleteLesson,
} from '../controllers/curriculum.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Correct import path

const router = express.Router();

// All lesson routes should be protected
router.use(isAuthenticated);

router.put('/:lessonId', updateLesson);
router.delete('/:lessonId', deleteLesson);

export default router;