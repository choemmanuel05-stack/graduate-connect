import React, { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Job { id: number; title: string; employer_name: string; applications_count: number; }

export const TrendingWidget: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/')
      .then((res: any) => setJobs((res.results || []).slice(0, 5)))
      .catch(() => setJobs([
        { id: 1, title: 'Software Engineer', employer_name: 'TechCorp', applications_count: 12 },
        { id: 2, title: 'Data Scientist', employer_name: 'DataInsights', applications_count: 8 },
        { id: 3, title: 'UX Designer', employer_name: 'CreativeStudio', applications_count: 6 },
      ]));
  }, []);

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={14} style={{ color: '#60A5FA' }} />
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Trending Jobs
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
        {jobs.map(job => (
          <div key={job.id} onClick={() => navigate('/jobs')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.5rem', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'background 150ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={13} style={{ color: '#60A5FA' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{job.employer_name} · {job.applications_count} applicants</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/jobs')}
        style={{ width: '100%', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#60A5FA', fontSize: '0.8rem', fontWeight: 600 }}>
        View all jobs <ArrowUpRight size={13} />
      </button>
    </div>
  );
};
