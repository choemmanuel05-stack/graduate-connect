import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Mail, BookOpen, Briefcase, User, FileText } from 'lucide-react';

interface FAQ { q: string; a: string; }

const SECTIONS = [
  {
    icon: User,
    title: 'Getting Started',
    color: '#60A5FA',
    faqs: [
      { q: 'How do I create an account?', a: 'Click "Register" on the login page. Choose your role (Graduate or Employer), fill in your details, and you\'re in. Registration takes under a minute.' },
      { q: 'What roles are available?', a: 'Graduate — for job seekers looking for opportunities. Employer — for companies posting jobs and searching candidates. Administrator — managed by the platform team.' },
      { q: 'Can I change my role after registering?', a: 'No — roles are fixed at registration. If you need a different role, create a new account with a different email address.' },
    ],
  },
  {
    icon: Briefcase,
    title: 'Jobs & Applications',
    color: '#34D399',
    faqs: [
      { q: 'How do I apply for a job?', a: 'Go to the Jobs page, find a position you like, and click Apply. You can optionally add a cover letter (use AI Generate for help). Your match score is calculated automatically when you submit.' },
      { q: 'What is a match score?', a: 'A 0–100 score showing how well your profile fits a job. It\'s based on GPA (40 pts), degree type (20 pts), specialization (20 pts), and skills overlap (20 pts). Higher = better fit.' },
      { q: 'How do I track my applications?', a: 'Go to Applications in the navigation bar. You\'ll see all your applications with their current status: Applied → Shortlisted → Interviewed.' },
      { q: 'Can I apply to the same job twice?', a: 'No — the system prevents duplicate applications to the same listing.' },
    ],
  },
  {
    icon: FileText,
    title: 'CV Builder',
    color: '#10B981',
    faqs: [
      { q: 'How do I access the CV Builder?', a: 'Click the green floating button (bottom-right of any page) or navigate to /cv-builder directly. It\'s available to all graduates.' },
      { q: 'Can I download my CV as a PDF?', a: 'Yes — click "Export PDF" in the CV Builder header. It opens a print-ready version of your CV in a new tab.' },
      { q: 'Does my CV save automatically?', a: 'Yes — your CV data is auto-saved to your browser\'s local storage as you type. It will be there when you come back.' },
      { q: 'What templates are available?', a: 'Three templates: Classic (blue header, traditional layout), Modern (sidebar with skills), and Minimal (clean lines). Switch between them in the Design step.' },
    ],
  },
  {
    icon: User,
    title: 'Profile & Credentials',
    color: '#8B5CF6',
    faqs: [
      { q: 'How do I upload a credential?', a: 'Go to your Profile page and click "Upload Credential". Accepted formats are PDF, JPEG, and PNG (max 5MB). An administrator will review and verify it.' },
      { q: 'Why do I need a verified credential?', a: 'Employers can only find you in candidate searches if you have at least one verified credential. It confirms your qualifications are genuine.' },
      { q: 'How long does verification take?', a: 'Typically 1–3 business days. You\'ll see the status change from "Pending" to "Verified" on your profile.' },
      { q: 'How do I improve my match score?', a: 'Add all your skills (comma-separated), keep your GPA accurate, fill in your specialization, and upload a verified credential. A complete profile gets 3x more employer views.' },
    ],
  },
];

const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0', lineHeight: 1.4 }}>{faq.q}</span>
        {open ? <ChevronUp size={16} style={{ color: '#64748B', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: '#64748B', flexShrink: 0 }} />}
      </button>
      {open && (
        <p style={{ fontSize: '0.875rem', color: '#BAC8D3', lineHeight: 1.7, paddingBottom: '1rem', margin: 0 }}>{faq.a}</p>
      )}
    </div>
  );
};

const Help: React.FC = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#2563EB,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
        <BookOpen size={26} color="white" />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.025em', margin: '0 0 0.5rem' }}>Help Centre</h1>
      <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Find answers to common questions about GraduateConnect</p>
    </div>

    {/* FAQ sections */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {SECTIONS.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} style={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 14, padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${section.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color: section.color }} />
              </div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: section.color, margin: 0 }}>{section.title}</h2>
            </div>
            {section.faqs.map(faq => <FAQItem key={faq.q} faq={faq} />)}
          </div>
        );
      })}
    </div>

    {/* Contact section */}
    <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg,rgba(37,99,235,0.12),rgba(16,185,129,0.08))', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
      <MessageCircle size={24} style={{ color: '#60A5FA', marginBottom: '0.75rem' }} />
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: '0 0 0.375rem' }}>Still need help?</h3>
      <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0 0 1rem' }}>Our support team is here for you</p>
      <a href="mailto:support@graduateconnect.com"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg,#2563EB,#60A5FA)', borderRadius: 8, color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
        <Mail size={15} /> support@graduateconnect.com
      </a>
    </div>
  </div>
);

export default Help;
