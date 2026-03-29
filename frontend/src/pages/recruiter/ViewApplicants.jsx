import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';

const ViewApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch jobs for dropdown
    api.get('/jobs').then(res => setJobs(res.data));
  }, []);

  const handleJobSelect = async (e) => {
    const jobId = e.target.value;
    setSelectedJob(jobId);
    if (!jobId) { setApplications([]); return; }
    
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">AI Shortlisting & Applicants</h3>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Job Posting to view applicants</label>
        <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-indigo-500" value={selectedJob} onChange={handleJobSelect}>
          <option value="">-- Select Job --</option>
          {jobs.map(job => (
             <option key={job._id} value={job._id}>{job.role} at {job.jobCompany}</option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center py-10"><Loader2 className="animate-spin inline" size={32} /></div>}

      {!loading && selectedJob && applications.length === 0 && (
        <div className="text-center text-gray-500 py-10">No applications yet for this job.</div>
      )}

      {!loading && applications.map(app => (
        <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h4 className="text-xl font-bold text-gray-900">{app.student.name}</h4>
                <p className="text-gray-500">{app.student.email} &bull; {app.student.phoneNo}</p>
             </div>
             <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                  ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {app.status}
                </span>
             </div>
          </div>
          
          {/* AI Analysis Section */}
          <div className="mt-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-indigo-500" size={20} />
                <h5 className="font-bold text-indigo-900">AI Shortlisting Match: 
                  <span className={app.aiEvaluation.isGoodCandidate ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                    {app.aiEvaluation.isGoodCandidate ? "HIGH FIT" : "LOW FIT"}
                  </span>
                </h5>
             </div>
             <p className="text-gray-700 text-sm italic">"{app.aiEvaluation.reasoning}"</p>
             
             {app.aiEvaluation.lackingSkills && app.aiEvaluation.lackingSkills.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Missing Technical Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {app.aiEvaluation.lackingSkills.map(skill => (
                      <span key={skill} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
             )}
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => handleStatusUpdate(app._id, 'Accepted')}
              className="flex-1 flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
            >
              <Check size={18}/> Accept Candidate
            </button>
            <button 
              onClick={() => handleStatusUpdate(app._id, 'Rejected')}
              className="flex-1 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition"
            >
              <X size={18}/> Reject Candidate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewApplicants;
