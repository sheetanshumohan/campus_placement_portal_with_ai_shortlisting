import express from 'express';
import { createJob, getJobs, getJobById } from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorizeRoles('Recruiter'), createJob);

router.route('/:id')
  .get(getJobById);

export default router;
