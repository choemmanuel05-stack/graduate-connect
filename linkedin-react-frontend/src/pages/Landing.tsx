import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Star, Users, FileText, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import Logo from '../components/common/Logo';

const features = [
  { icon: <Briefcase size={22} />, title: 'Smart Job Matching', desc: 'AI-powered matching scores your compatibility with every job based on your skills, GPA, and degree.' },
  { icon: <FileText size={22} />, title: 'CV Builder', desc: 'Build a professional CV in minutes with 3 templates, AI-generated summaries, and instant PDF export.' },
  { icon: <GraduationCap size={22} />, title: 'Credential Verification', desc: 'Upload your academic certificates for verification — employers trust verified graduates more.' },
  { icon: <MessageSquare size={22} />, title: 'AI Assistant', desc: 'Get instant help with job searching, interview prep, skill gap analysis, and career advice.' },
  { icon: <Star size={22} />, title: 'Interview Prep', desc: 'Practice with AI-generated interview questions tailored to each job you apply for.' },
  { icon: <Users size={22} />, title: 'Employer Network', desc: 'Connect with top employers in Cameroon actively looking for qualified graduates.' },
];

const steps = [
  { n: '1', title: 'Create your account', desc: 'Sign up with your Gmail address in under a minute.' },
  { n: '2', title: 'Build your profile', desc: 'Add your education, skills, and upload your credentials.' },
  { n: '3', title: 'Get matched', desc: 'Browse AI-matched jobs and apply with one click.' },
];

const Landing: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)', color: '#F1F5F9', fontFamily: 'inherit' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: '1px solid rgba(148,163,184,0.1)', position: 'sticky', top: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <Logo size="md" />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" style={{ padding: '0.5rem 1.25rem', borderRadius: 8, border: '1px solid rgba(148,163,184,0.25)', color: '#CBD5E1', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all 150ms' }}>
            Sign In
          </Link>
          <Link to="/register" style={{ padding: '0.5rem 1.25rem', borderRadius: 8, background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 1.5rem 4rem', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, color: '#60A5FA', marginBottom: '1.5rem' }}>
          <Star size={13} /> Built for CATUC Bamenda Graduates
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          Connect Graduates with{' '}
          <span style={{ background: 'linear-gradient(135deg,#60A5FA,#818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Opportunities
          </span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
          GraduateConnect uses AI to match graduates with the right jobs — based on your skills, GPA, and degree. Build your CV, get verified, and land your first job faster.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.45)' }}>
            Create Free Account <ArrowRight size={16} />
          </Link>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', borderRadius: 10, fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid rgba(148,163,184,0.2)' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '2rem 1.5rem', borderTop: '1px solid rgba(148,163,184,0.08)', borderBottom: '1px solid rgba(148,163,184,0.08)', background: 'rgba(255,255,255,0.02)' }}>
        {[['AI-Powered', 'Job Matching'], ['3', 'CV Templates'], ['Free', 'To Use'], ['CATUC', 'Bamenda']].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#60A5FA' }}>{val}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Everything you need to launch your career</h2>
        <p style={{ textAlign: 'center', color: '#64748B', marginBottom: '3rem', fontSize: '0.95rem' }}>Powerful tools built specifically for graduates and employers.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 14, padding: '1.5rem', transition: 'border-color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)')}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', marginBottom: '1rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(148,163,184,0.08)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Get started in 3 steps</h2>
          <p style={{ color: '#64748B', marginBottom: '3rem', fontSize: '0.95rem' }}>No complicated setup. Just sign up and start applying.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 14, padding: '1.25rem 1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For employers */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Are you an employer?</h2>
        <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.95rem', maxWidth: 560, margin: '0 auto 2rem' }}>Post jobs, search verified graduates by skills and GPA, and let AI rank the best candidates for you.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['Post jobs for free', 'AI candidate ranking', 'Verified credentials', 'Manage applications'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#94A3B8' }}>
              <CheckCircle size={15} style={{ color: '#34D399' }} /> {item}
            </div>
          ))}
        </div>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.45)' }}>
          Register as Employer <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(148,163,184,0.1)', padding: '2rem 1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.8rem' }}>
        <Logo size="sm" />
        <p style={{ marginTop: '0.75rem' }}>© {new Date().getFullYear()} GraduateConnect · CATUC Bamenda · Built to connect graduates with opportunities</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
          <Link to="/terms" style={{ color: '#475569', textDecoration: 'none' }}>Terms</Link>
          <Link to="/privacy" style={{ color: '#475569', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/help" style={{ color: '#475569', textDecoration: 'none' }}>Help</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
