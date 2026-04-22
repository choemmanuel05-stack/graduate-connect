import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Briefcase, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { companyService } from '../services/companyService';

const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    companyService.getCompany(Number(id))
      .then((res: any) => setData(res))
      .catch(() => setError('Company not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ height: 200, borderRadius: 16, background: 'var(--surface-2)', animation: 'shimmer 1.5s ease infinite', backgroundSize: '600px 100%' }} className="skeleton" />
    </div>
  );

  if (error || !data) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
      <Building2 size={48} style={{ color: '#64748B', marginBottom: '1rem' }} />
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Company not found</h2>
      <button onClick={() => navigate(-1)} style={{ color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>← Go back</button>
    </div>
  );

  const { company, jobs, jobs_count } = data;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.875rem', marginBottom: '1.25rem', padding: 0 }}
        onMouseEnter={e => (e.currentTarget.style.color = '#60A5FA')}
        onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Company header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: '1.25rem', boxShadow: 'var(--s1)' }}>
        {/* Banner */}
        <div style={{ height: 100, background: 'linear-gradient(135deg, #1D4ED8 0%, #0D9488 100%)' }} />
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          {/* Logo */}
          <div style={{ width: 72, height: 72, borderRadius: 16, background: company.logo_url ? 'transparent' : 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -36, marginBottom: '1rem', border: '3px solid var(--surface)', overflow: 'hidden', boxShadow: 'var(--s2)' }}>
            {company.logo_url
              ? <img src={company.logo_url} alt={company.company_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <Building2 size={32} color="white" />}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{company.company_name}</h1>
              {company.industry && <p style={{ fontSize: '0.9rem', color: '#60A5FA', fontWeight: 600, margin: '0.25rem 0' }}>{company.industry}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                {company.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <MapPin size={13} />{company.location}
                  </span>
                )}
                {company.company_size && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <Users size={13} />{company.company_size} employees
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={13} />{jobs_count} open position{jobs_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            {company.website && (
              <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 8, color: '#60A5FA', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                <Globe size={14} /> Website <ExternalLink size={12} />
              </a>
            )}
          </div>

          {company.description && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              {company.description}
            </p>
          )}
        </div>
      </div>

      {/* Open positions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--s1)' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={16} style={{ color: '#60A5FA' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Open Positions ({jobs_count})</span>
        </div>

        {jobs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No open positions at the moment. Check back soon.
          </div>
        ) : (
          <div>
            {jobs.map((job: any) => (
              <div key={job.id}
                onClick={() => navigate('/jobs')}
                style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{job.title}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    {job.location && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.location}</span>}
                    {job.job_type && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.1rem 0.5rem', background: 'rgba(37,99,235,0.1)', color: '#93C5FD', borderRadius: 99 }}>
                        {job.job_type.replace('_', ' ')}
                      </span>
                    )}
                    {job.deadline && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Closes {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#64748B', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
