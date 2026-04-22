import React, { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, User, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults(null); setIsOpen(false); return;
    }
    setIsLoading(true);
    api.get('/search/', { params: { q: debouncedQuery } })
      .then((res: any) => { setResults(res); setIsOpen(true); })
      .catch(() => setResults(null))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const hasResults = results && (
    (results.jobs?.length > 0) ||
    (results.graduates?.length > 0) ||
    (results.companies?.length > 0)
  );

  const handleSelect = (path: string) => {
    setQuery(''); setIsOpen(false); navigate(path);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => hasResults && setIsOpen(true)}
          placeholder="Search jobs, graduates, companies…"
          style={{ width: '100%', padding: '0.5rem 2.25rem 0.5rem 2.25rem', background: 'var(--surface-2)', border: '1.5px solid var(--border-2)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none', transition: 'border-color 150ms' }}
          onFocus2={e => { (e.target as HTMLInputElement).style.borderColor = '#60A5FA'; }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null); setIsOpen(false); }}
            style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.1rem' }}>
            <X size={14} />
          </button>
        )}
        {isLoading && (
          <div style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, border: '2px solid rgba(96,165,250,0.2)', borderTopColor: '#60A5FA', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && hasResults && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 12, boxShadow: 'var(--s4)', zIndex: 200, overflow: 'hidden', maxHeight: 400, overflowY: 'auto' }}>

          {/* Jobs */}
          {results.jobs?.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 0.875rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jobs</div>
              {results.jobs.map((job: any) => (
                <button key={job.id} onClick={() => handleSelect('/jobs')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 100ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={13} style={{ color: '#60A5FA' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{job.employer_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Graduates */}
          {results.graduates?.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 0.875rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', borderTop: results.jobs?.length > 0 ? '1px solid var(--border)' : 'none' }}>Graduates</div>
              {results.graduates.map((g: any) => (
                <button key={g.id} onClick={() => handleSelect('/graduates')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 100ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={13} style={{ color: '#34D399' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{g.full_name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{g.university}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Companies */}
          {results.companies?.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 0.875rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', borderTop: '1px solid var(--border)' }}>Companies</div>
              {results.companies.map((c: any) => (
                <button key={c.id} onClick={() => handleSelect(`/company/${c.id}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 100ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building2 size={13} style={{ color: '#C4B5FD' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{c.company_name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{c.industry || c.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* View all */}
          <button onClick={() => handleSelect(`/jobs?q=${encodeURIComponent(query)}`)}
            style={{ width: '100%', padding: '0.625rem 0.875rem', background: 'var(--surface-2)', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.78rem', color: '#60A5FA', fontWeight: 600, textAlign: 'center' }}>
            View all results for "{query}"
          </button>
        </div>
      )}

      {isOpen && !hasResults && !isLoading && query.length >= 2 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 12, boxShadow: 'var(--s4)', zIndex: 200, padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          No results for "{query}"
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
