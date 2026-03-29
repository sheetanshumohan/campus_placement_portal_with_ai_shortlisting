import React, { useState, useEffect } from 'react';
import api from '../../api';
import { PlusCircle, Loader2 } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    jobType: 'Full-time', jobCompany: '', role: '', minimumQualifications: '', technicalSkillsRequired: '', applicationDeadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      // Just filter client side for now to keep simple, assuming getJobs gets all.
      // In production, should have an endpoint specifically for recruiter's jobs.
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...newJob,
        technicalSkillsRequired: newJob.technicalSkillsRequired.split(',').map(s => s.trim())
      };
      await api.post('/jobs', payload);
      setShowForm(false);
      fetchJobs();
      setNewJob({ jobType: 'Full-time', jobCompany: '', role: '', minimumQualifications: '', technicalSkillsRequired: '', applicationDeadline: '' });
    } catch (err) {
      alert("Failed to create job.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Job Postings</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <PlusCircle size={20} /> {showForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm mb-1 text-gray-600">Company</label><input required className="w-full p-2 border rounded-lg" value={newJob.jobCompany} onChange={e=>setNewJob({...newJob, jobCompany:e.target.value})} /></div>
            <div><label className="block text-sm mb-1 text-gray-600">Role</label><input required className="w-full p-2 border rounded-lg" value={newJob.role} onChange={e=>setNewJob({...newJob, role:e.target.value})} /></div>
            <div><label className="block text-sm mb-1 text-gray-600">Job Type</label>
              <select className="w-full p-2 border rounded-lg" value={newJob.jobType} onChange={e=>setNewJob({...newJob, jobType:e.target.value})}>
                <option>Full-time</option><option>Internship</option><option>Part-time</option>
              </select>
            </div>
            <div><label className="block text-sm mb-1 text-gray-600">Deadline</label><input required type="date" className="w-full p-2 border rounded-lg" value={newJob.applicationDeadline} onChange={e=>setNewJob({...newJob, applicationDeadline:e.target.value})} /></div>
            <div className="md:col-span-2"><label className="block text-sm mb-1 text-gray-600">Min Qualifications</label><textarea required className="w-full p-2 border rounded-lg" value={newJob.minimumQualifications} onChange={e=>setNewJob({...newJob, minimumQualifications:e.target.value})} /></div>
            <div className="md:col-span-2"><label className="block text-sm mb-1 text-gray-600">Technical Skills (comma separated)</label><input required className="w-full p-2 border rounded-lg" value={newJob.technicalSkillsRequired} onChange={e=>setNewJob({...newJob, technicalSkillsRequired:e.target.value})} /></div>
            <div className="md:col-span-2">
              <button type="submit" disabled={creating} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                {creating ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="text-center py-10"><Loader2 className="animate-spin inline" size={32} /></div> : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg">{job.role} at {job.jobCompany}</h4>
              <p className="text-sm text-gray-500">Skills required: {job.technicalSkillsRequired.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
