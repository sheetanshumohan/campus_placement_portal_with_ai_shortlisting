import express from 'express';
import { applyForJob, getJobApplications, updateApplicationStatus, getStudentApplications } from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get student's own applications
router.get('/my-applications', protect, authorizeRoles('Student'), getStudentApplications);

// Apply for a job (Students only)
router.post('/:jobId', protect, authorizeRoles('Student'), applyForJob);

// Get applications for a job (Recruiter who posted it)
router.get('/job/:jobId', protect, authorizeRoles('Recruiter'), getJobApplications);

// Update status of an application (Recruiter)
router.put('/:id/status', protect, authorizeRoles('Recruiter'), updateApplicationStatus);

export default router;
