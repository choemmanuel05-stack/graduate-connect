import React, { useState } from 'react';
import { MessageSquare, Sparkles, Briefcase } from 'lucide-react';
import { InterviewQuestions } from '../components/ai/InterviewQuestions';
import { useAuth } from '../hooks/useAuth';

// ── Field must be defined OUTSIDE the component so React doesn't
//    recreate it on every render (which causes inputs to lose focus)
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, placeholder, multiline = false }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#263348', border: '1.5px solid rgba(148,163,184,0.25)', borderRadius: 8, fontSize: '0.85rem', color: '#F1F5F9', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
        onFocus={e => { e.target.style.borderColor = '#60A5FA'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(148,163,184,0.25)'; }}
      />
    ) : (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#263348', border: '1.5px solid rgba(148,163,184,0.25)', borderRadius: 8, fontSize: '0.85rem', color: '#F1F5F9', fontFamily: 'inherit', outline: 'none' }}
        onFocus={e => { e.target.style.borderColor = '#60A5FA'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(148,163,184,0.25)'; e.target.style.boxShadow = 'none'; }}
      />
    )}
  </div>
);

const InterviewPrep: React.FC = () => {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [skills, setSkills] = useState('');
  const [ready, setReady] = useState(false);

  const canGenerate = jobTitle.trim().length > 0 && skills.trim().length > 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Sparkles size={14} style={{ color: '#8B5CF6' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI-Powered</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.025em', margin: 0 }}>Interview Prep</h1>
        <p style={{ color: '#BAC8D3', fontSize: '0.875rem', marginTop: '0.25rem' }}>Generate tailored interview questions for any job role</p>
      </div>

      {!ready ? (
        <div style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 14, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Briefcase size={15} style={{ color: '#60A5FA' }} />
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#93C5FD' }}>Job Details</span>
          </div>

          <Field
            label="Job Title *"
            value={jobTitle}
            onChange={setJobTitle}
            placeholder="e.g. Software Engineer, Data Analyst"
          />
          <Field
            label="Required Skills *"
            value={skills}
            onChange={setSkills}
            placeholder="e.g. Python, React, SQL, Communication"
          />
          <Field
            label="Job Description (optional)"
            value={jobDesc}
            onChange={setJobDesc}
            placeholder="Paste the job description for more tailored questions…"
            multiline
          />

          {/* Read-only profile skills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.35rem' }}>
              Your Skills (auto-filled from profile)
            </label>
            <input
              value={(user as any)?.profile?.skills || ''}
              readOnly
              placeholder="Complete your profile to auto-fill skills"
              style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#1a2535', border: '1.5px solid rgba(148,163,184,0.12)', borderRadius: 8, fontSize: '0.85rem', color: '#64748B', fontFamily: 'inherit', outline: 'none', cursor: 'default' }}
            />
          </div>

          <button
            onClick={() => { if (canGenerate) setReady(true); }}
            disabled={!canGenerate}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem',
              background: canGenerate ? 'linear-gradient(135deg,#7C3AED,#8B5CF6)' : '#263348',
              border: 'none', borderRadius: 10,
              color: canGenerate ? '#fff' : '#64748B',
              fontSize: '0.9rem', fontWeight: 700,
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              boxShadow: canGenerate ? '0 4px 14px rgba(124,58,237,0.4)' : 'none',
              transition: 'all 150ms ease',
            }}>
            <MessageSquare size={16} />
            Generate Interview Questions
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>{jobTitle}</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>Skills: {skills}</p>
            </div>
            <button
              onClick={() => setReady(false)}
              style={{ padding: '0.4rem 0.875rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#94A3B8', fontSize: '0.8rem', cursor: 'pointer' }}>
              ← Change Job
            </button>
          </div>
          <InterviewQuestions
            jobTitle={jobTitle}
            jobDescription={jobDesc}
            requiredSkills={skills}
            graduateSkills={(user as any)?.profile?.skills || ''}
            degree={(user as any)?.profile?.degree || ''}
          />
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
