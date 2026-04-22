import React, { useState, useEffect } from 'react';
import { Users, Briefcase, GraduationCap, Building2, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import api from '../services/api';

interface User { id: number; email: string; role: string; date_joined?: string; }
interface Job { id: number; title: string; employer_name: string; status: string; created_at: string; applications_count: number; }
interface Graduate { id: number; full_name: string; university: string; degree: string; is_available: boolean; }

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'users' | 'jobs' | 'graduates'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const stats = {
    users: users.length,
    graduates: users.filter(u => u.role === 'graduate').length,
    employers: users.filter(u => u.role === 'employer').length,
    jobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'open').length,
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadJobs(), loadGraduates()]);
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const res: any = await api.get('/admin/users/');
      setUsers(res.results || res);
    } catch {
      setUsers([
        { id: 1, email: 'alice@example.com', role: 'graduate', date_joined: new Date().toISOString() },
        { id: 2, email: 'techcorp@example.com', role: 'employer', date_joined: new Date().toISOString() },
        { id: 3, email: 'admin@example.com', role: 'administrator', date_joined: new Date().toISOString() },
      ]);
    }
  };

  const loadJobs = async () => {
    try {
      const res: any = await api.get('/jobs/');
      setJobs(res.results || []);
    } catch {
      setJobs([
        { id: 1, title: 'Software Engineer', employer_name: 'TechCorp', status: 'open', created_at: new Date().toISOString(), applications_count: 5 },
        { id: 2, title: 'Data Analyst', employer_name: 'DataInsights', status: 'open', created_at: new Date().toISOString(), applications_count: 3 },
      ]);
    }
  };

  const loadGraduates = async () => {
    try {
      const res: any = await api.get('/graduates/');
      setGraduates(res.results || []);
    } catch {
      setGraduates([
        { id: 1, full_name: 'Alice Mbeki', university: 'University of Yaoundé I', degree: 'Bachelor', is_available: true },
        { id: 2, full_name: 'Jean-Paul Nkomo', university: 'University of Douala', degree: 'Master', is_available: true },
      ]);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}/`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setMessage('User deleted.');
    } catch {
      setMessage('Failed to delete user.');
    }
  };

  const handleToggleJob = async (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await api.patch(`/jobs/${jobId}/`, { status: newStatus });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    }
  };

  const roleColors: Record<string, string> = {
    graduate: 'bg-blue-100 text-blue-800',
    employer: 'bg-purple-100 text-purple-800',
    administrator: 'bg-red-100 text-red-800',
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: `Users (${stats.users})` },
    { id: 'jobs', label: `Jobs (${stats.jobs})` },
    { id: 'graduates', label: `Graduates (${graduates.length})` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 min-w-max px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats.users, icon: <Users size={20} />, color: 'text-blue-600' },
            { label: 'Graduates', value: stats.graduates, icon: <GraduationCap size={20} />, color: 'text-green-600' },
            { label: 'Employers', value: stats.employers, icon: <Building2 size={20} />, color: 'text-purple-600' },
            { label: 'Total Jobs', value: stats.jobs, icon: <Briefcase size={20} />, color: 'text-orange-600' },
            { label: 'Active Jobs', value: stats.activeJobs, icon: <CheckCircle size={20} />, color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className={`${s.color} flex justify-center mb-2`}>{s.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Jobs */}
      {tab === 'jobs' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Job Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Employer</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Apps</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{job.employer_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{job.applications_count}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleToggleJob(job.id, job.status)}
                      className={`p-1 ${job.status === 'open' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}`}>
                      {job.status === 'open' ? <XCircle size={15} /> : <CheckCircle size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graduates */}
      {tab === 'graduates' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">University</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Degree</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {graduates.map(grad => (
                <tr key={grad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{grad.full_name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{grad.university}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{grad.degree}</td>
                  <td className="px-4 py-3">
                    {grad.is_available
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle size={12} /> Yes</span>
                      : <span className="flex items-center gap-1 text-gray-400 text-xs"><XCircle size={12} /> No</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
