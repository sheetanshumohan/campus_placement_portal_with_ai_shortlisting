import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Save, Loader2 } from 'lucide-react';

const ProfileEditor = () => {
  const [profile, setProfile] = useState({ jobRole: '', companyWorking: '', linkedinUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles').then(res => {
      setProfile(res.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profiles/recruiter', profile);
      alert('Profile saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline" size={32} /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Recruiter Profile</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input type="text" className="w-full p-3 border rounded-xl" value={profile.companyWorking || ''} onChange={e => setProfile({...profile, companyWorking: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
          <input type="text" className="w-full p-3 border rounded-xl" value={profile.jobRole || ''} onChange={e => setProfile({...profile, jobRole: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input type="url" className="w-full p-3 border rounded-xl" value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} />
        </div>
        <div className="md:col-span-2 mt-4">
          <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition">
             {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
