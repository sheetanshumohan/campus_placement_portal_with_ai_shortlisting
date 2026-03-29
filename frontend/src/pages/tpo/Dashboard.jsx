import React, { useState } from 'react';
import Analytics from './Analytics';
import { UserCircle, LineChart } from 'lucide-react';

const TPODashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-800 mb-6 px-2">TPO Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                activeTab === 'analytics' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LineChart size={20} /> Placement Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
};

export default TPODashboard;
