import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Sparkles, Save, Loader2 } from 'lucide-react';

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    collegeName: '', degree: '', major: '', skills: '', githubUrl: '', linkedinUrl: '', resumeUrl: '', expectedGraduation: '', professionalSummary: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profiles');
      setProfile({
        ...res.data,
        skills: res.data.skills ? res.data.skills.join(', ') : '',
        expectedGraduation: res.data.expectedGraduation ? res.data.expectedGraduation.split('T')[0] : ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await api.put('/profiles/student', payload);
      setProfile({
        ...res.data,
        skills: res.data.skills ? res.data.skills.join(', ') : '',
        expectedGraduation: res.data.expectedGraduation ? res.data.expectedGraduation.split('T')[0] : ''
      });
      setMessage('Profile updated successfully! AI Summary may have been regenerated.');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline" size={32} /></div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h3>
      
      {profile.professionalSummary && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl relative">
          <Sparkles className="absolute top-4 right-4 text-blue-400" size={24} />
          <h4 className="font-bold text-blue-900 mb-2">AI-Generated Professional Summary</h4>
          <p className="text-blue-800 text-sm leading-relaxed">{profile.professionalSummary}</p>
        </div>
      )}

      {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg whitespace-pre-wrap">{message}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
          <input type="text" className="w-full p-3 border rounded-xl" value={profile.collegeName || ''} onChange={e => setProfile({...profile, collegeName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g. B.Tech" value={profile.degree || ''} onChange={e => setProfile({...profile, degree: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
          <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g. Computer Science" value={profile.major || ''} onChange={e => setProfile({...profile, major: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Component</label>
          <input type="date" className="w-full p-3 border rounded-xl" value={profile.expectedGraduation || ''} onChange={e => setProfile({...profile, expectedGraduation: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input type="text" className="w-full p-3 border rounded-xl" placeholder="React, Node.js, Python" value={profile.skills || ''} onChange={e => setProfile({...profile, skills: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
          <input type="url" className="w-full p-3 border rounded-xl" value={profile.githubUrl || ''} onChange={e => setProfile({...profile, githubUrl: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input type="url" className="w-full p-3 border rounded-xl" value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (Portfolio, Drive)</label>
          <input type="url" className="w-full p-3 border rounded-xl" placeholder="https://" value={profile.resumeUrl || ''} onChange={e => setProfile({...profile, resumeUrl: e.target.value})} />
        </div>
        <div className="md:col-span-2 mt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition">
             {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} {saving ? 'Saving...' : 'Save Profile & Update Auto-Summary'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
