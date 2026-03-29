import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req, res) => {
  try {
    const { jobType, jobCompany, role, minimumQualifications, technicalSkillsRequired, applicationDeadline } = req.body;

    const job = new Job({
      recruiter: req.user._id,
      jobType,
      jobCompany,
      role,
      minimumQualifications,
      technicalSkillsRequired,
      applicationDeadline
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public or Student/Recruiter
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('recruiter', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
