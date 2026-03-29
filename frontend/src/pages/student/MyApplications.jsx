import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading your applications...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">My Application Status</h3>

      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center text-gray-500 border border-gray-100">
          You haven't applied to any jobs yet. Check the Browse Jobs tab!
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md">
              <div>
                <h4 className="font-bold text-xl text-gray-900">{app.job.role}</h4>
                <p className="text-blue-600 font-medium">{app.job.jobCompany} &bull; {app.job.jobType}</p>
                <p className="text-gray-400 text-sm mt-1">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex flex-col md:items-end gap-2 text-left md:text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide
                  ${app.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' : 
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                    'bg-yellow-100 text-yellow-700 border border-yellow-200'}
                `}>
                  {app.status === 'Accepted' && <CheckCircle size={18} />}
                  {app.status === 'Rejected' && <XCircle size={18} />}
                  {app.status === 'Pending' && <Clock size={18} />}
                  {app.status}
                </div>
                
                {app.recruiterMessage && (
                  <p className="text-sm italic text-gray-600 max-w-xs">&quot;{app.recruiterMessage}&quot;</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
