import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Send, X, Loader2, CheckCircle } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Track applied jobs
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchProfile();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profiles');
      setProfileData({
        ...res.data,
        skills: res.data.skills ? res.data.skills.join(', ') : '',
        expectedGraduation: res.data.expectedGraduation ? res.data.expectedGraduation.split('T')[0] : ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setAppliedJobIds(res.data.map(app => app.job._id || app.job));
    } catch (err) {
      console.error("Failed to fetch applied jobs");
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      // 1. Sync updated fields to global profile first
      const profilePayload = {
        ...profileData,
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      await api.put('/profiles/student', profilePayload);

      // 2. Submit Application triggering AI evaluation using the synchronized profile
      await api.post(`/applications/${selectedJob._id}`);
      
      setAppliedJobIds([...appliedJobIds, selectedJob._id]);
      setMessage({ type: 'success', text: `Successfully applied to ${selectedJob.jobCompany}! AI has evaluated your updated profile.` });
      setSelectedJob(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply. You may have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;

  return (
    <div className="space-y-6 relative">
      <h3 className="text-2xl font-bold text-gray-800">Available Opportunities</h3>
      
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center text-gray-500 border border-gray-100">No jobs posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => {
            const hasApplied = appliedJobIds.includes(job._id);
            return (
              <div key={job._id} className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border ${hasApplied ? 'border-green-100' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{job.role}</h4>
                    <p className="text-blue-600 font-medium">{job.jobCompany} &bull; {job.jobType}</p>
                  </div>
                  <button
                    onClick={() => !hasApplied && handleApplyClick(job)}
                    disabled={hasApplied}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition ${
                      hasApplied 
                        ? 'bg-green-50 text-green-700 cursor-not-allowed opacity-80' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {hasApplied ? <CheckCircle size={18} /> : <Send size={18} />} 
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
                <div className="text-gray-600 text-sm mb-4">
                  <p><strong>Min Qualifications:</strong> {job.minimumQualifications}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.technicalSkillsRequired.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Modal Overlay */}
      {selectedJob && profileData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-auto">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply for {selectedJob.role}</h3>
            <p className="text-gray-500 mb-6">Review your professional application details. Editing here will also update your synced profile.</p>
            
            <form onSubmit={handleFinalSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                  <input type="text" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.collegeName || ''} onChange={e => setProfileData({...profileData, collegeName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input type="text" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.degree || ''} onChange={e => setProfileData({...profileData, degree: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                  <input type="text" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.major || ''} onChange={e => setProfileData({...profileData, major: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                  <input type="date" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.expectedGraduation || ''} onChange={e => setProfileData({...profileData, expectedGraduation: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input type="text" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.skills || ''} onChange={e => setProfileData({...profileData, skills: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input type="url" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.githubUrl || ''} onChange={e => setProfileData({...profileData, githubUrl: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input type="url" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.linkedinUrl || ''} onChange={e => setProfileData({...profileData, linkedinUrl: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
                  <input type="url" className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm" value={profileData.resumeUrl || ''} onChange={e => setProfileData({...profileData, resumeUrl: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary (Auto-Generated by AI)</label>
                  <textarea readOnly rows={3} className="w-full p-2.5 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 text-sm cursor-not-allowed" value={profileData.professionalSummary || 'No summary generated yet. Save your profile skills first to generate one.'} />
                  <p className="text-xs text-gray-400 mt-1">This is automatically generated based on the profile data you save.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t mt-6 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-70">
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} 
                  {submitting ? 'Submitting & Evaluating...' : 'Submit Final Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
