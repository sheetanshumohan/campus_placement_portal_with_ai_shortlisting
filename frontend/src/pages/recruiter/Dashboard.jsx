import React, { useState } from 'react';
import ProfileEditor from './ProfileEditor';
import ManageJobs from './ManageJobs';
import ViewApplicants from './ViewApplicants';
import { UserCircle, Briefcase, Users } from 'lucide-react';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('manageJobs');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 mb-6 px-2">Recruiter Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('manageJobs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'manageJobs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase size={20} /> Manage Jobs
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'applicants' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} /> AI Shortlisting
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserCircle size={20} /> My Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'profile' && <ProfileEditor />}
        {activeTab === 'manageJobs' && <ManageJobs />}
        {activeTab === 'applicants' && <ViewApplicants />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
