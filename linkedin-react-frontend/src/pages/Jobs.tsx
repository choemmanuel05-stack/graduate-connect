import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, DollarSign, ChevronRight, Sparkles, Star } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { useRecommendedJobs } from '../hooks/useRecommendations';
import { CoverLetterGenerator } from '../components/ai/CoverLetterGenerator';
import { JobGapAnalyzer } from '../components/ai/JobGapAnalyzer';
import { SuccessPredictor } from '../components/ai/SuccessPredictor';
import { InterviewQuestions } from '../components/ai/InterviewQuestions';

interface Job {
  id: number; title: string; employer_name: string; employer_location: string;
  location: string; job_type: string; salary_min: number | null; salary_max: number | null;
  description: string; required_skills: string; created_at: string;
  deadline: string | null; applications_count: number; match_score?: number;
}

const typeLabel: Record<string, string> = {
  full_time: 'Full Time', part_time: 'Part Time',
  internship: 'Internship', contract: 'Contract', remote: 'Remote',
};
const typeColor: Record<string, string> = {
  full_time: 'badge-blue', part_time: 'badge-purple', internship: 'badge-green',
  contract: 'badge-yellow', remote: 'badge-gray',
};

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const { jobs: recommendedJobs } = useRecommendedJobs();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState('');

  useEffect(() => { loadJobs(); }, [search, jobType]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res: any = await jobService.getJobs({ search, job_type: jobType });
      setJobs(res.results || []);
    } catch {
      setJobs([
        { id: 1, title: 'Senior Software Engineer', employer_name: 'TechCorp Cameroon', employer_location: 'Yaoundé', location: 'Yaoundé, Cameroon', job_type: 'full_time', salary_min: 600000, salary_max: 900000, description: 'Build and scale our core platform using React and Django. You will work with a talented team to deliver high-quality software solutions.', required_skills: 'React, Python, Django, PostgreSQL, REST APIs', created_at: new Date().toISOString(), deadline: '2026-06-01', applications_count: 12 },
        { id: 2, title: 'Data Scientist', employer_name: 'DataInsights Africa', employer_location: 'Douala', location: 'Douala, Cameroon', job_type: 'full_time', salary_min: 500000, salary_max: 750000, description: 'Analyze large datasets and build predictive models to drive business decisions across our African markets.', required_skills: 'Python, Machine Learning, SQL, TensorFlow, Tableau', created_at: new Date().toISOString(), deadline: '2026-05-20', applications_count: 8 },
        { id: 3, title: 'Marketing Intern', employer_name: 'BrandCo', employer_location: 'Remote', location: 'Remote', job_type: 'internship', salary_min: null, salary_max: null, description: 'Support our marketing team with campaigns, social media management, and content creation.', required_skills: 'Communication, Social Media, Canva, Copywriting', created_at: new Date().toISOString(), deadline: null, applications_count: 5 },
        { id: 4, title: 'UX/UI Designer', employer_name: 'CreativeStudio', employer_location: 'Yaoundé', location: 'Yaoundé, Cameroon', job_type: 'contract', salary_min: 400000, salary_max: 600000, description: 'Design beautiful and intuitive user interfaces for our suite of enterprise products.', required_skills: 'Figma, Adobe XD, Prototyping, User Research', created_at: new Date().toISOString(), deadline: '2026-05-30', applications_count: 15 },
      ]);
    } finally { setLoading(false); }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await jobService.applyToJob(selectedJob.id, coverLetter);
      setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
      showToast('Application submitted successfully!');
      setSelectedJob(null); setCoverLetter('');
    } catch { showToast('Failed to apply. You may have already applied.'); }
    finally { setApplying(false); }
  };

  const fmt = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${(min/1000).toFixed(0)}k – ${(max/1000).toFixed(0)}k FCFA`;
    return `${((min||max)!/1000).toFixed(0)}k FCFA`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-blue-500" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Opportunities</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Your Dream Job</h1>
        <p style={{ color: '#94A3B8' }}>Discover opportunities from top companies across Africa</p>
      </div>

      {/* Recommended for You — only for graduates */}
      {user?.role === 'graduate' && recommendedJobs.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Star size={15} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recommended for You
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {recommendedJobs.slice(0, 3).map((job: any) => (
              <div key={job.id} onClick={() => setSelectedJob(job)}
                style={{ background: 'var(--surface)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--r-lg)', padding: '1rem', cursor: 'pointer', transition: 'all 200ms ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                {job.match_score && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 99, border: '1px solid rgba(245,158,11,0.3)' }}>
                    {job.match_score}% match
                  </div>
                )}
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.25rem', paddingRight: '4rem' }}>{job.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#60A5FA', marginBottom: '0.5rem' }}>{job.employer_name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="surface p-3 mb-6 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search job title, company, skills..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10 bg-gray-50" />
        </div>
        <select value={jobType} onChange={e => setJobType(e.target.value)}
          className="input sm:w-44 bg-gray-50">
          <option value="">All Types</option>
          {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-800">{jobs.length}</span> positions available
        </p>
      )}

      {/* Job list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {jobs.map(job => (
            <div key={job.id} className="job-card animate-fade-up group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h2>
                    <span className={`badge ${typeColor[job.job_type] || 'badge-gray'}`}>
                      {typeLabel[job.job_type] || job.job_type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-blue-600 mb-2">{job.employer_name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3" style={{ color: '#BAC8D3' }}>
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location || job.employer_location}</span>
                    {fmt(job.salary_min, job.salary_max) && (
                      <span className="flex items-center gap-1"><DollarSign size={11} />{fmt(job.salary_min, job.salary_max)}</span>
                    )}
                    {job.deadline && (
                      <span className="flex items-center gap-1"><Clock size={11} />Closes {new Date(job.deadline).toLocaleDateString('en-US', {month:'short',day:'numeric'})}</span>
                    )}
                    <span className="flex items-center gap-1"><Briefcase size={11} />{job.applications_count} applicants</span>
                  </div>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: '#CBD5E1' }}>{job.description}</p>
                  {job.required_skills && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.required_skills.split(',').slice(0,4).map(s => (
                        <span key={s} className="skill-chip">{s.trim()}</span>
                      ))}
                      {job.required_skills.split(',').length > 4 && (
                        <span className="skill-chip text-gray-400">+{job.required_skills.split(',').length - 4}</span>
                      )}
                    </div>
                  )}
                  {user?.role === 'graduate' && job.required_skills && (
                    <div style={{ marginTop: '0.625rem' }}>
                      <SuccessPredictor
                        jobTitle={job.title}
                        jobSkills={job.required_skills}
                        graduateSkills={user?.profile?.skills || ''}
                        gpa={user?.profile?.gpa}
                      />
                    </div>
                  )}
                </div>
                {user?.role === 'graduate' && (
                  <button onClick={() => setSelectedJob(job)} disabled={appliedJobs.has(job.id)}
                    className={`btn flex-shrink-0 ${appliedJobs.has(job.id) ? 'btn-secondary opacity-60' : 'btn-primary'}`}>
                    {appliedJobs.has(job.id) ? 'Applied ✓' : <>Apply <ChevronRight size={14} /></>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedJob(null)}>
          <div className="modal p-6" style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>{selectedJob.title}</h2>
                <p style={{ fontSize: '0.875rem', color: '#60A5FA', marginTop: '0.2rem' }}>{selectedJob.employer_name}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>

            {/* AI Skill Gap */}
            <div style={{ marginBottom: '1rem' }}>
              <JobGapAnalyzer
                jobTitle={selectedJob.title}
                jobSkills={selectedJob.required_skills}
                graduateSkills={user?.profile?.skills || ''}
              />
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0' }} />

            {/* AI Cover Letter */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#BAC8D3', marginBottom: '0.5rem' }}>
                Cover Letter <span style={{ color: '#64748B', fontWeight: 400 }}>(optional)</span>
              </label>
              <CoverLetterGenerator
                jobTitle={selectedJob.title}
                companyName={selectedJob.employer_name}
                jobDescription={selectedJob.description}
                graduateName={user?.fullName || ''}
                skills={user?.profile?.skills || ''}
                university={user?.profile?.university || ''}
                degree={user?.profile?.degree || ''}
                onGenerated={setCoverLetter}
              />
              {!coverLetter && (
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4}
                  placeholder="Or write your own cover letter..."
                  className="field" style={{ marginTop: '0.5rem', resize: 'none', fontSize: '0.875rem' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleApply} disabled={applying} className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button onClick={() => setSelectedJob(null)} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Jobs;
