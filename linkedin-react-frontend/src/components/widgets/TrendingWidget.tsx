import React, { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Job {
  id: number;
  title: string;
  employer_name: string;
  applications_count: number;
  location?: string;
  job_type?: string;
}

export const TrendingWidget: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/')
      .then((res: any) => setJobs((res.results || []).slice(0, 6)))
      .catch(() => setJobs([
        { id: 1, title: 'Software Engineer', employer_name: 'TechCorp', applications_count: 12, location: 'Yaoundé', job_type: 'Full Time' },
        { id: 2, title: 'Data Scientist', employer_name: 'DataInsights', applications_count: 8, location: 'Douala', job_type: 'Full Time' },
        { id: 3, title: 'UX Designer', employer_name: 'CreativeStudio', applications_count: 6, location: 'Bamenda', job_type: 'Contract' },
        { id: 4, title: 'Project Manager', employer_name: 'BuildCo', applications_count: 4, location: 'Bafoussam', job_type: 'Full Time' },
        { id: 5, title: 'Marketing Officer', employer_name: 'BrandHouse', applications_count: 9, location: 'Yaoundé', job_type: 'Part Time' },
        { id: 6, title: 'Accountant', employer_name: 'FinanceGroup', applications_count: 5, location: 'Douala', job_type: 'Full Time' },
      ]));
  }, []);

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(29,78,216,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={16} style={{ color: '#60A5FA' }} />
          </div>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Trending Jobs</span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Latest opportunities from top employers</p>
          </div>
        </div>
        <button onClick={() => navigate('/jobs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.875rem', background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.2)', borderRadius: 8, color: '#60A5FA', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      {/* 2-column job card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
        {jobs.map(job => (
          <div key={job.id} onClick={() => navigate('/jobs')}
            style={{
              padding: '1rem',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--surface-2, rgba(255,255,255,0.03))',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(29,78,216,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            {/* Icon + title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(29,78,216,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Briefcase size={15} style={{ color: '#60A5FA' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.8375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{job.employer_name}</p>
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.125rem' }}>
              {job.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <MapPin size={10} /> {job.location}
                </span>
              )}
              {job.job_type && (
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: 99, background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.2)', color: '#60A5FA', fontSize: '0.68rem', fontWeight: 600 }}>
                  {job.job_type}
                </span>
              )}
            </div>

            {/* Applicants */}
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={10} /> {job.applications_count} applicants
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
