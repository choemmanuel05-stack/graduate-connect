import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, Trash2, ChevronDown, ChevronUp, TrendingUp, Clock } from 'lucide-react';
import { jobService } from '../services/jobService';
import { JobDescriptionScorer } from '../components/ai/JobDescriptionScorer';
import { validateJobTitle, validateGPA, validateUrl } from '../utils/validators';

// Inline error helper
const FErr: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {msg}</p> : null;

// ── JobField — defined outside component to prevent focus loss ───────────────
interface JobFieldProps {
  label: string; name: string; type?: string; placeholder?: string;
  value: string; onChange: (name: string, value: string) => void; error?: string;
}
const JobField: React.FC<JobFieldProps> = ({ label, name, type = 'text', placeholder = '', value, onChange, error }) => (
  <div>
    <label className="input-label">{label}</label>
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(name, e.target.value)}
      className="input"
      style={error ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
    {error && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {error}</p>}
  </div>
);

interface Job { id: number; title: string; location: string; job_type: string; status: string; applications_count: number; created_at: string; }
interface Application { id: number; graduate_name: string; graduate_email: string; cover_letter: string; status: string; applied_at: string; }

const statusBadge: Record<string, string> = {
  pending: 'badge-yellow', reviewed: 'badge-blue',
  shortlisted: 'badge-green', rejected: 'badge-red', accepted: 'badge-green',
};

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [applications, setApplications] = useState<Record<number, Application[]>>({});
  const [toast, setToast] = useState('');
  const [newJob, setNewJob] = useState({ title: '', description: '', requirements: '', location: '', job_type: 'full_time', salary_min: '', salary_max: '', required_skills: '', deadline: '' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const res: any = await jobService.getEmployerJobs();
      setJobs(res.results || []);
    } catch {
      setJobs([
        { id: 1, title: 'Software Engineer', location: 'Yaoundé', job_type: 'full_time', status: 'open', applications_count: 5, created_at: new Date().toISOString() },
        { id: 2, title: 'Data Analyst', location: 'Douala', job_type: 'full_time', status: 'open', applications_count: 3, created_at: new Date().toISOString() },
      ]);
    } finally { setLoading(false); }
  };

  const loadApplications = async (jobId: number) => {
    if (applications[jobId]) return;
    try {
      const res: any = await jobService.getJobApplications(jobId);
      setApplications(prev => ({ ...prev, [jobId]: res.results || [] }));
    } catch { setApplications(prev => ({ ...prev, [jobId]: [] })); }
  };

  const toggleJob = (jobId: number) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    setExpandedJob(jobId);
    loadApplications(jobId);
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    // Validate job form
    const errs: Record<string, string> = {};
    const titleErr = validateJobTitle(newJob.title);
    if (titleErr) errs.title = titleErr;
    if (!newJob.description.trim()) errs.description = 'Job description is required';
    if (newJob.description.trim().length < 50) errs.description = 'Description should be at least 50 characters';
    if (newJob.salary_min && newJob.salary_max) {
      if (Number(newJob.salary_min) > Number(newJob.salary_max)) errs.salary = 'Minimum salary cannot exceed maximum salary';
    }
    if (newJob.deadline) {
      const deadline = new Date(newJob.deadline);
      if (deadline <= new Date()) errs.deadline = 'Application deadline must be a future date';
    }
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    try {
      await jobService.createJob(newJob);
      showToast('Job posted successfully!');
      setShowForm(false);
      setNewJob({ title: '', description: '', requirements: '', location: '', job_type: 'full_time', salary_min: '', salary_max: '', required_skills: '', deadline: '' });
      loadJobs();
    } catch { showToast('Failed to post job.'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await jobService.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch { showToast('Failed to delete.'); }
  };

  const handleStatusChange = async (jobId: number, appId: number, status: string) => {
    try {
      await jobService.updateApplicationStatus(jobId, appId, status);
      setApplications(prev => ({ ...prev, [jobId]: prev[jobId].map(a => a.id === appId ? { ...a, status } : a) }));
    } catch { setApplications(prev => ({ ...prev, [jobId]: prev[jobId].map(a => a.id === appId ? { ...a, status } : a) })); }
  };

  const totalApps = jobs.reduce((s, j) => s + j.applications_count, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-blue-500" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Employer</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={15} /> Post a Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 stagger">
        {[
          { label: 'Active Jobs', value: jobs.filter(j => j.status === 'open').length, icon: <Briefcase size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Applications', value: totalApps, icon: <Users size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Avg. per Job', value: jobs.length ? (totalApps / jobs.length).toFixed(1) : 0, icon: <TrendingUp size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="stat-card animate-fade-up">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Post Job Form */}
      {showForm && (
        <div className="surface p-6 mb-6 animate-fade-up">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Post New Job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <JobField label="Job Title *" name="title" placeholder="e.g. Software Engineer"
              value={newJob.title} onChange={(n,v) => { setNewJob(p=>({...p,[n]:v})); setFormErrors(e=>({...e,[n]:''})); }}
              error={formErrors.title} />
            <JobField label="Location" name="location" placeholder="e.g. Yaoundé or Remote"
              value={newJob.location} onChange={(n,v) => setNewJob(p=>({...p,[n]:v}))} />
            <div>
              <label className="input-label">Job Type</label>
              <select name="job_type" value={newJob.job_type}
                onChange={e => setNewJob(p => ({ ...p, job_type: e.target.value }))} className="input">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="input-label">Application Deadline</label>
              <input type="date" value={newJob.deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => { setNewJob(p=>({...p,deadline:e.target.value})); setFormErrors(er=>({...er,deadline:''})); }}
                className="input" style={formErrors.deadline ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
              {formErrors.deadline && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {formErrors.deadline}</p>}
            </div>
            <JobField label="Min Salary (FCFA)" name="salary_min" type="number" placeholder="e.g. 150000"
              value={newJob.salary_min} onChange={(n,v) => setNewJob(p=>({...p,[n]:v}))} />
            <JobField label="Max Salary (FCFA)" name="salary_max" type="number" placeholder="e.g. 400000"
              value={newJob.salary_max} onChange={(n,v) => setNewJob(p=>({...p,[n]:v}))} />
          </div>
          {formErrors.salary && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginBottom: '0.75rem' }}>⚠ {formErrors.salary}</p>}
          <div className="mb-4">
            <label className="input-label">Required Skills</label>
            <input name="required_skills" value={newJob.required_skills}
              onChange={e => setNewJob(p => ({ ...p, required_skills: e.target.value }))}
              placeholder="e.g. Python, React, SQL (comma-separated)" className="input" />
          </div>
          <div className="mb-4">
            <label className="input-label">Job Description *</label>
            <textarea name="description" value={newJob.description} rows={4}
              onChange={e => { setNewJob(p => ({ ...p, description: e.target.value })); setFormErrors(er=>({...er,description:''})); }}
              className="input resize-none"
              style={formErrors.description ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
            {formErrors.description && <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {formErrors.description}</p>}
          </div>
          {newJob.description.length > 50 && (
            <div className="mb-4">
              <JobDescriptionScorer initialText={newJob.description} compact />
            </div>
          )}
          <div className="mb-5">
            <label className="input-label">Requirements</label>
            <textarea name="requirements" value={newJob.requirements} rows={3}
              onChange={e => setNewJob(p => ({ ...p, requirements: e.target.value }))} className="input resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="btn btn-primary flex-1 py-2.5">Post Job</button>
            <button onClick={() => { setShowForm(false); setFormErrors({}); }} className="btn btn-secondary flex-1 py-2.5">Cancel</button>
          </div>
        </div>
      )}

      {/* Jobs */}
      <div className="section-header"><Briefcase size={10} />Your Job Postings</div>
      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : jobs.length === 0 ? (
        <div className="surface p-12 text-center">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No jobs posted yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Post a Job" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="surface overflow-hidden">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <span className={`badge ${job.status === 'open' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#BAC8D3' }}>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.job_type.replace('_', ' ')}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <Users size={13} className="text-blue-400" /> {job.applications_count}
                  </span>
                  <button onClick={() => toggleJob(job.id)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                    {expandedJob === job.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => handleDelete(job.id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {expandedJob === job.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <p className="section-header">Applications ({applications[job.id]?.length || 0})</p>
                  {!applications[job.id] ? (
                    <div className="skeleton h-12 rounded-xl" />
                  ) : applications[job.id].length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No applications yet</p>
                  ) : (
                    <div className="space-y-2">
                      {applications[job.id].map(app => (
                        <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900">{app.graduate_name}</p>
                            <p className="text-xs text-gray-500">{app.graduate_email}</p>
                            {app.cover_letter && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{app.cover_letter}</p>}
                          </div>
                          <select value={app.status}
                            onChange={e => handleStatusChange(job.id, app.id, e.target.value)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold cursor-pointer ${statusBadge[app.status] || 'badge-gray'}`}>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="accepted">Accepted</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
