import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import { evaluateCandidate } from '../services/openaiService.js';

// @desc    Apply for a job and trigger AI evaluation
// @route   POST /api/applications/:jobId
// @access  Private/Student
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if already applied
    const existingApp = await Application.findOne({ student: studentId, job: jobId });
    if (existingApp) return res.status(400).json({ message: 'You have already applied for this job' });

    // Fetch Student Profile
    const studentProfile = await StudentProfile.findOne({ user: studentId });
    if (!studentProfile) return res.status(400).json({ message: 'Student profile not completely setup' });

    // Call OpenAI to evaluate candidate
    const evaluation = await evaluateCandidate(studentProfile, job);

    const application = new Application({
      student: studentId,
      job: jobId,
      aiEvaluation: evaluation
    });

    const savedApp = await application.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Ensure the recruiter owns the job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        select: 'name email phoneNo',
      });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, recruiterMessage } = req.body;
    
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (recruiterMessage) {
      application.recruiterMessage = recruiterMessage;
    }

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a student
// @route   GET /api/applications/my-applications
// @access  Private/Student
export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'jobCompany role jobType');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
