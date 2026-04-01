import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import TPOProfile from '../models/TPOProfile.js';

// @desc    Get dashboard analytics for TPO
// @route   GET /api/analytics
// @access  Private/TPO
export const getTPOAnalytics = async (req, res) => {
  try {
    // 1. Get TPO's college name
    const tpoProfile = await TPOProfile.findOne({ user: req.user._id });
    if (!tpoProfile || !tpoProfile.collegeName) {
      return res.json({
        totalCompanies: 0,
        placedStudents: [],
        topSkills: [],
        placementsByBranch: []
      });
    }
    const tpoCollege = tpoProfile.collegeName;

    // 2. Find students belonging to this college
    const students = await StudentProfile.find({ collegeName: tpoCollege }).select('user major');
    const studentUserIds = students.map(s => s.user);

    const studentMajorMap = {};
    students.forEach(s => {
       studentMajorMap[s.user.toString()] = s.major || 'Unknown Branch';
    });

    // 3. Shows a list of students placed at different companies (Filtered by college)
    const placedApplications = await Application.find({ 
      status: 'Accepted',
      student: { $in: studentUserIds }
    })
      .populate('student', 'name email')
      .populate('job', 'jobCompany role');

    const placementsByBranchCounts = {};

    const placedStudents = placedApplications.map(app => {
      const branch = studentMajorMap[app.student._id.toString()] || 'Unknown Branch';
      placementsByBranchCounts[branch] = (placementsByBranchCounts[branch] || 0) + 1;

      return {
        studentName: app.student.name,
        studentEmail: app.student.email,
        branch: branch,
        company: app.job?.jobCompany || 'Unknown Company',
        role: app.job?.role || 'Unknown Role'
      };
    });

    const placementsByBranch = Object.entries(placementsByBranchCounts).map(entry => ({
      branch: entry[0], count: entry[1]
    }));

    // 4. Total No of Companies Visited & Skills required
    // Based on jobs that students from this college have applied to
    const allCollegeApplications = await Application.find({ student: { $in: studentUserIds } }).populate('job');
    
    // Filter out applications where the job might have been deleted
    const appliedJobs = allCollegeApplications
      .map(app => app.job)
      .filter(job => job != null); 

    const distinctCompanies = new Set(appliedJobs.map(job => job.jobCompany));
    const totalCompanies = distinctCompanies.size;

    const skillCounts = {};
    // Use a Map of unique jobs to avoid double-counting skills if multiple students applied to the same job
    const uniqueJobMap = new Map();
    appliedJobs.forEach(job => uniqueJobMap.set(job._id.toString(), job));

    Array.from(uniqueJobMap.values()).forEach(job => {
      // Safely check if technicalSkillsRequired exists before iterating
      if (job.technicalSkillsRequired && Array.isArray(job.technicalSkillsRequired)) {
        job.technicalSkillsRequired.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    // Sort skills by count
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => ({ skill: entry[0], count: entry[1] }));

    res.json({
      totalCompanies,
      placedStudents,
      topSkills,
      placementsByBranch
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
