import React, { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, ArrowUpRight, MapPin, Clock, Users, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Job {
  id: number;
  title: string;
  employer_name: string;
  employer_location?: string;
  applications_count: number;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  requirements?: string;
  deadline?: string;
  created_at?: string;
}

const FALLBACK_JOBS: Job[] = [
  { id: 1, title: 'Software Engineer', employer_name: 'TechCorp Cameroon', applications_count: 12, location: 'Yaoundé', job_type: 'Full Time', salary_min: 150000, salary_max: 250000, description: 'Build and maintain scalable web applications using modern frameworks. Work with a cross-functional team to deliver high-quality software.', deadline: '2026-07-15' },
  { id: 2, title: 'Data Scientist', employer_name: 'DataInsights Africa', applications_count: 8, location: 'Douala', job_type: 'Full Time', salary_min: 180000, salary_max: 300000, description: 'Analyse large datasets to extract actionable insights. Develop machine learning models to support business decisions.', deadline: '2026-07-20' },
  { id: 3, title: 'UX/UI Designer', employer_name: 'CreativeStudio', applications_count: 6, location: 'Bamenda', job_type: 'Contract', salary_min: 100000, salary_max: 180000, description: 'Design intuitive user interfaces for web and mobile products. Conduct user research and create wireframes and prototypes.', deadline: '2026-07-10' },
  { id: 4, title: 'Project Manager', employer_name: 'BuildCo Ltd', applications_count: 4, location: 'Bafoussam', job_type: 'Full Time', salary_min: 200000, salary_max: 350000, description: 'Lead cross-functional teams to deliver projects on time and within budget. Manage stakeholder communication and risk mitigation.', deadline: '2026-08-01' },
  { id: 5, title: 'Marketing Officer', employer_name: 'BrandHouse', applications_count: 9, location: 'Yaoundé', job_type: 'Part Time', salary_min: 80000, salary_max: 130000, description: 'Develop and execute marketing campaigns across digital and traditional channels. Track performance metrics and optimise strategies.', deadline: '2026-07-25' },
  { id: 6, title: 'Accountant', employer_name: 'FinanceGroup', applications_count: 5, location: 'Douala', job_type: 'Full Time', salary_min: 120000, salary_max: 200000, description: 'Manage financial records, prepare reports, and ensure compliance with tax regulations. Support budgeting and forecasting activities.', deadline: '2026-07-30' },
  { id: 7, title: 'Network Engineer', employer_name: 'ConnectTech', applications_count: 3, location: 'Yaoundé', job_type: 'Full Time', salary_min: 160000, salary_max: 260000, description: 'Design, implement, and maintain network infrastructure. Troubleshoot connectivity issues and ensure system uptime.', deadline: '2026-08-05' },
  { id: 8, title: 'HR Manager', employer_name: 'PeopleFirst', applications_count: 7, location: 'Douala', job_type: 'Full Time', salary_min: 170000, salary_max: 280000, description: 'Oversee recruitment, onboarding, and employee relations. Develop HR policies and ensure compliance with labour laws.', deadline: '2026-07-18' },
  { id: 9, title: 'Civil Engineer', employer_name: 'InfraWorks', applications_count: 11, location: 'Ngaoundéré', job_type: 'Contract', salary_min: 200000, salary_max: 400000, description: 'Design and supervise construction of infrastructure projects including roads, bridges, and buildings.', deadline: '2026-08-10' },
];

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
  if (min && max) return `XAF ${fmt(min)} – ${fmt(max)}`;
  if (min) return `From XAF ${fmt(min)}`;
  if (max) return `Up to XAF ${fmt(max)}`;
  return null;
}

function daysUntil(dateStr?: string): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Closes today';
  if (diff === 1) return '1 day left';
  return `${diff} days left`;
}

const jobTypeColor: Record<string, { bg: string; color: string; border: string }> = {
  'Full Time':  { bg: 'rgba(29,78,216,0.12)',  color: '#60A5FA', border: 'rgba(29,78,216,0.25)' },
  'Part Time':  { bg: 'rgba(5,150,105,0.12)',  color: '#34D399', border: 'rgba(5,150,105,0.25)' },
  'Contract':   { bg: 'rgba(217,119,6,0.12)',  color: '#FCD34D', border: 'rgba(217,119,6,0.25)' },
  'Internship': { bg: 'rgba(139,92,246,0.12)', color: '#C4B5FD', border: 'rgba(139,92,246,0.25)' },
};

export const TrendingWidget: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/')
      .then((res: any) => {
        const list = res.results || res || [];
        setJobs(list.length > 0 ? list.slice(0, 9) : FALLBACK_JOBS);
      })
      .catch(() => setJobs(FALLBACK_JOBS));
  }, []);

  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(29,78,216,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} style={{ color: '#60A5FA' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Trending Jobs
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Latest opportunities from top employers
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1rem', background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.25)', borderRadius: 8, color: '#60A5FA', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
        >
          View all <ArrowUpRight size={13} />
        </button>
      </div>

      {/* ── Job cards grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {jobs.map(job => {
          const typeStyle = jobTypeColor[job.job_type || ''] || jobTypeColor['Full Time'];
          const salary = formatSalary(job.salary_min, job.salary_max);
          const deadline = daysUntil(job.deadline);
          const isUrgent = deadline && (deadline === 'Closes today' || deadline.includes('1 day') || deadline.includes('2 day') || deadline.includes('3 day'));

          return (
            <div
              key={job.id}
              onClick={() => navigate('/jobs')}
              style={{
                padding: '1.25rem',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'var(--surface-2, rgba(255,255,255,0.03))',
                cursor: 'pointer',
                transition: 'all 180ms ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(29,78,216,0.45)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top row: icon + title + badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(29,78,216,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase size={18} style={{ color: '#60A5FA' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
                      {job.title}
                    </p>
                    {job.job_type && (
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 99, background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {job.job_type}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                    {job.employer_name}
                  </p>
                </div>
              </div>

              {/* Description snippet */}
              {job.description && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                  {job.description.length > 110 ? job.description.slice(0, 110) + '…' : job.description}
                </p>
              )}

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                {job.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {job.location}
                  </span>
                )}
                {salary && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#34D399' }}>
                    <DollarSign size={11} /> {salary}
                  </span>
                )}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <Users size={11} /> {job.applications_count} applicants
                </span>
                {deadline && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: isUrgent ? '#FCA5A5' : 'var(--text-muted)' }}>
                    <Calendar size={11} /> {deadline}
                  </span>
                )}
              </div>

              {/* Apply button */}
              <button
                onClick={e => { e.stopPropagation(); navigate('/jobs'); }}
                style={{ marginTop: '0.25rem', padding: '0.5rem', borderRadius: 8, background: 'rgba(29,78,216,0.12)', border: '1px solid rgba(29,78,216,0.25)', color: '#60A5FA', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'background 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(29,78,216,0.22)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(29,78,216,0.12)')}
              >
                Apply Now →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
