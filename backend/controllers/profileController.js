import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import TPOProfile from '../models/TPOProfile.js';
import { generateProfessionalSummary } from '../services/openaiService.js';

// @desc    Get user profile (auto-detects role)
// @route   GET /api/profiles
// @access  Private
export const getProfile = async (req, res) => {
  try {
    let profile;
    if (req.user.role === 'Student') profile = await StudentProfile.findOne({ user: req.user._id });
    else if (req.user.role === 'Recruiter') profile = await RecruiterProfile.findOne({ user: req.user._id });
    else if (req.user.role === 'TPO') profile = await TPOProfile.findOne({ user: req.user._id });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Student Profile
// @route   PUT /api/profiles/student
// @access  Private/Student
export const updateStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    Object.assign(profile, req.body);

    // If certain fields that affect the summary change, regenerate it
    if (req.body.skills || req.body.major || req.body.collegeName) {
      if(profile.skills && profile.skills.length > 0) {
        profile.professionalSummary = await generateProfessionalSummary({
          collegeName: profile.collegeName,
          degree: profile.degree,
          major: profile.major,
          skills: profile.skills
        });
      }
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Recruiter Profile
// @route   PUT /api/profiles/recruiter
// @access  Private/Recruiter
export const updateRecruiterProfile = async (req, res) => {
    try {
      const profile = await RecruiterProfile.findOneAndUpdate(
        { user: req.user._id },
        req.body,
        { new: true }
      );
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// @desc    Update TPO Profile
// @route   PUT /api/profiles/tpo
// @access  Private/TPO
export const updateTPOProfile = async (req, res) => {
    try {
      const profile = await TPOProfile.findOneAndUpdate(
        { user: req.user._id },
        req.body,
        { new: true }
      );
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
