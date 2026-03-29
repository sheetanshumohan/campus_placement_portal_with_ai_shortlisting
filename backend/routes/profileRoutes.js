import express from 'express';
import { getProfile, updateStudentProfile, updateRecruiterProfile, updateTPOProfile } from '../controllers/profileController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get own profile (any role)
router.get('/', protect, getProfile);

// Update specific profiles
router.put('/student', protect, authorizeRoles('Student'), updateStudentProfile);
router.put('/recruiter', protect, authorizeRoles('Recruiter'), updateRecruiterProfile);
router.put('/tpo', protect, authorizeRoles('TPO'), updateTPOProfile);

export default router;
