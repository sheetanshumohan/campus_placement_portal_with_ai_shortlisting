import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Loader2, Building2, Users } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline text-purple-600" size={32} /></div>;
  if (!data) return <div className="text-center py-10 text-red-500">Failed to load analytics data.</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Placement Overview</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 rounded-xl text-purple-600"><Building2 size={24} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Companies Visiting</p><p className="text-2xl font-bold text-gray-900">{data.totalCompanies}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><Users size={24} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Students Placed</p><p className="text-2xl font-bold text-gray-900">{data.placedStudents?.length || 0}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Required */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Most Demanded Skills</h4>
          {data.topSkills?.length > 0 ? (
            <div className="space-y-3">
              {data.topSkills.map((skillObj, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{skillObj.skill}</span>
                  <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold">{skillObj.count} demand(s)</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No skill data available.</p>}
        </div>

        {/* Recently Placed Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Recent Placements</h4>
          {data.placedStudents?.length > 0 ? (
            <div className="space-y-4">
              {data.placedStudents.map((placed, i) => (
                <div key={i} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <p className="font-bold text-gray-900">{placed.studentName}</p>
                  <p className="text-sm text-gray-600">{placed.branch} • Placed at <span className="text-blue-600 font-medium">{placed.company}</span> as {placed.role}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No placements recorded yet.</p>}
        </div>
      </div>

      {/* Placements By Branch */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Placements by Branch</h4>
        {data.placementsByBranch?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {data.placementsByBranch.map((item, i) => (
                <div key={i} className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col justify-between">
                  <span className="text-sm text-gray-600 font-medium mb-1 truncate" title={item.branch}>{item.branch}</span>
                  <span className="text-2xl font-extrabold text-green-700">{item.count}</span>
                </div>
             ))}
          </div>
        ) : <p className="text-gray-500 text-sm">No branch data available yet.</p>}
      </div>
    </div>
  );
};

export default Analytics;
