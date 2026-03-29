import React, { useState } from 'react';
import ProfileEditor from './ProfileEditor';
import JobListings from './JobListings';
import MyApplications from './MyApplications';
import { UserCircle, Briefcase, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 mb-6 px-2">Student Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'jobs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase size={20} /> Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'applications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={20} /> My Applications
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
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
        {activeTab === 'jobs' && <JobListings />}
        {activeTab === 'applications' && <MyApplications />}
      </div>
    </div>
  );
};

export default StudentDashboard;
