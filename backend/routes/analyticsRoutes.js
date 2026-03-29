import express from 'express';
import { getTPOAnalytics } from '../controllers/analyticsController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/', protect, authorizeRoles('TPO'), getTPOAnalytics);
export default router;
