import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';

interface Application {
  id: number;
  job: number;
  job_title: string;
  company_name: string;
  cover_letter: string;
  status: string;
  applied_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: 'Pending',     color: 'badge-yellow', icon: <Clock size={12} /> },
  reviewed:    { label: 'Reviewed',    color: 'badge-blue',   icon: <AlertCircle size={12} /> },
  shortlisted: { label: 'Shortlisted', color: 'badge-green',  icon: <CheckCircle size={12} /> },
  accepted:    { label: 'Accepted',    color: 'badge-green',  icon: <CheckCircle size={12} /> },
  rejected:    { label: 'Rejected',    color: 'badge-red',    icon: <XCircle size={12} /> },
};

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { loadApplications(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadApplications = async () => {
    try {
      const res: any = await jobService.getMyApplications();
      setApplications(res.results || []);
    } catch {
      setApplications([
        { id: 1, job: 1, job_title: 'Software Engineer', company_name: 'TechCorp', cover_letter: 'I am very interested in this position...', status: 'shortlisted', applied_at: new Date().toISOString() },
        { id: 2, job: 2, job_title: 'Data Analyst', company_name: 'DataInsights', cover_letter: '', status: 'pending', applied_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId: number, status: string) => {
    if (status === 'shortlisted' || status === 'accepted') {
      showToast(`Cannot withdraw — application is already ${status}`);
      return;
    }
    if (!confirm('Withdraw this application? This cannot be undone.')) return;
    setWithdrawing(appId);
    try {
      await savedJobService.withdrawApplication(appId);
      setApplications(prev => prev.filter(a => a.id !== appId));
      showToast('Application withdrawn successfully');
    } catch (err: any) {
      showToast(err?.response?.data?.error || 'Failed to withdraw application');
    } finally {
      setWithdrawing(null);
    }
  };

  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted' || a.status === 'accepted').length,
    pending: applications.filter(a => a.status === 'pending').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-green-600' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No applications yet.</p>
          <a href="/jobs" className="text-[#0A66C2] text-sm hover:underline mt-2 inline-block">Browse Jobs</a>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const s = statusConfig[app.status] || statusConfig.pending;
            return (
              <div key={app.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div style={{ flex: 1 }}>
                    <h3 className="font-semibold" style={{ color: '#F1F5F9' }}>{app.job_title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#60A5FA' }}>{app.company_name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                      Applied {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    {app.cover_letter && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 max-w-md">{app.cover_letter}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                      {s.icon} {s.label}
                    </span>
                    {(app.status === 'pending' || app.status === 'reviewed') && (
                      <button
                        onClick={() => handleWithdraw(app.id, app.status)}
                        disabled={withdrawing === app.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.625rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, color: '#FCA5A5', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Trash2 size={11} />{withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '6rem', right: '1.5rem', background: '#0F172A', color: '#F1F5F9', padding: '0.75rem 1.25rem', borderRadius: 12, boxShadow: 'var(--s3)', fontSize: '0.875rem', fontWeight: 500, zIndex: 300, animation: 'fadeUp 0.25s ease' }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
