import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle, Briefcase, User, FileText, X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'gc_onboarding_done';

const steps = [
  {
    id: 'welcome',
    icon: '👋',
    title: 'Welcome to GraduateConnect!',
    desc: 'The platform connecting CATUC Bamenda graduates with top employers across Africa.',
    action: null,
  },
  {
    id: 'profile',
    icon: '👤',
    title: 'Complete your profile',
    desc: 'A complete profile gets 3× more views. Add your skills, GPA, and specialization to improve your match score.',
    action: { label: 'Go to Profile', path: '/profile' },
  },
  {
    id: 'cv',
    icon: '📄',
    title: 'Build your CV',
    desc: 'Use our built-in CV Builder to create a professional resume in minutes. Choose from 3 templates and export as PDF.',
    action: { label: 'Open CV Builder', path: '/cv-builder' },
  },
  {
    id: 'jobs',
    icon: '💼',
    title: 'Browse job opportunities',
    desc: 'Explore jobs matched to your skills. Your AI match score shows how well you fit each role.',
    action: { label: 'Browse Jobs', path: '/jobs' },
  },
];

const employerSteps = [
  {
    id: 'welcome',
    icon: '👋',
    title: 'Welcome to GraduateConnect!',
    desc: 'Find qualified graduates from CATUC Bamenda and beyond. Post jobs, search candidates, and manage applications.',
    action: null,
  },
  {
    id: 'profile',
    icon: '🏢',
    title: 'Set up your company profile',
    desc: 'Add your company name, industry, location, and description. Graduates will see this when they apply.',
    action: { label: 'Set Up Profile', path: '/dashboard' },
  },
  {
    id: 'post',
    icon: '📝',
    title: 'Post your first job',
    desc: 'Create a job listing with required skills and qualifications. Our AI will match it to the best candidates automatically.',
    action: { label: 'Post a Job', path: '/dashboard' },
  },
  {
    id: 'search',
    icon: '🔍',
    title: 'Search for candidates',
    desc: 'Filter graduates by degree, GPA, specialization, and skills. Only verified graduates appear in search results.',
    action: { label: 'Find Graduates', path: '/graduates' },
  },
];

export const OnboardingWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const done = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
    if (!done) {
      // Small delay so the page loads first
      setTimeout(() => setVisible(true), 800);
    }
  }, [user]);

  const dismiss = () => {
    if (user) localStorage.setItem(`${STORAGE_KEY}_${user.id}`, '1');
    setVisible(false);
  };

  const handleAction = (path: string) => {
    dismiss();
    navigate(path);
  };

  if (!visible || !user) return null;

  const flow = user.role === 'employer' ? employerSteps : steps;
  const current = flow[step];
  const isLast = step === flow.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div onClick={dismiss} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, animation: 'fadeIn 0.2s ease' }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '100%', maxWidth: 480, zIndex: 2001,
        background: 'var(--surface)', border: '1px solid var(--border-2)',
        borderRadius: 24, boxShadow: 'var(--s4)',
        animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', width: `${((step + 1) / flow.length) * 100}%`, background: 'linear-gradient(90deg,#2563EB,#10B981)', transition: 'width 400ms ease', borderRadius: 99 }} />
        </div>

        {/* Close */}
        <button onClick={dismiss} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.25rem' }}>
          <X size={18} />
        </button>

        <div style={{ padding: '2rem' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem' }}>
            {flow.map((_, i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 99, background: i <= step ? '#2563EB' : 'var(--border)', transition: 'background 300ms' }} />
            ))}
          </div>

          {/* Icon */}
          <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>{current.icon}</div>

          {/* Content */}
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.625rem', letterSpacing: '-0.02em' }}>{current.title}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 1.75rem' }}>{current.desc}</p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            {current.action && (
              <button onClick={() => handleAction(current.action!.path)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', border: 'none', borderRadius: 12, color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                {current.action.label} <ChevronRight size={16} />
              </button>
            )}
            <button onClick={() => isLast ? dismiss() : setStep(s => s + 1)}
              style={{ padding: '0.65rem', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 12, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              {isLast ? '✓ Get started' : 'Next →'}
            </button>
          </div>

          {/* Step count */}
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748B', marginTop: '1rem' }}>
            Step {step + 1} of {flow.length}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};
