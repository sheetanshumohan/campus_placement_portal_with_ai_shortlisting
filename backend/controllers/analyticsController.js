import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Get dashboard analytics for TPO
// @route   GET /api/analytics
// @access  Private/TPO
export const getTPOAnalytics = async (req, res) => {
  try {
    // 1. Total No of Companies Visited
    const distinctCompanies = await Job.distinct('jobCompany');
    const totalCompanies = distinctCompanies.length;

    // 2. Shows a list of students placed at different companies
    const placedApplications = await Application.find({ status: 'Accepted' })
      .populate('student', 'name email')
      .populate('job', 'jobCompany role');

    const placedStudents = placedApplications.map(app => ({
      studentName: app.student.name,
      studentEmail: app.student.email,
      company: app.job.jobCompany,
      role: app.job.role
    }));

    // 3. Shows which skills is required the most
    const jobs = await Job.find({});
    const skillCounts = {};
    jobs.forEach(job => {
      job.technicalSkillsRequired.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    // Sort skills by count
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => ({ skill: entry[0], count: entry[1] }));

    // Note: Percentage placed by branch, average package, and year-over-year trends
    // are highly complex to calculate without extensive simulated historical data and 
    // salary fields. We return placeholders for those to be implemented fully later.

    res.json({
      totalCompanies,
      placedStudents,
      topSkills,
      placeholders: {
        percentagePlacedByBranch: "Data insufficient yet",
        averagePackage: "Data insufficient yet",
        comparisonToLastYear: "Data insufficient yet"
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
