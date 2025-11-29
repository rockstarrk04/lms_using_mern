import express from 'express';
import {
  getMyEnrollments,
  checkout,
  paymentVerification,
  enrollFree,
} from '../controllers/enrollment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Correct import path

const router = express.Router();

// All enrollment routes should be protected
router.use(isAuthenticated);

router.get('/me', getMyEnrollments);
router.post('/checkout', checkout);
router.post('/payment-verification', paymentVerification);
router.post('/enroll-free', enrollFree);

export default router;