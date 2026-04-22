import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{title}</h2>
    <div style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.8 }}>{children}</div>
  </div>
);

const DataItem: React.FC<{ label: string; desc: string }> = ({ label, desc }) => (
  <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
    <span style={{ fontWeight: 600, color: '#93C5FD', minWidth: 160, fontSize: '0.875rem' }}>{label}</span>
    <span style={{ color: '#CBD5E1', fontSize: '0.875rem' }}>{desc}</span>
  </div>
);

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = 'April 13, 2026';

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>
      {/* Header */}
      <div style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(148,163,184,0.12)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Logo size="md" />
        <button onClick={() => navigate(-1)} style={{ color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Last updated: {lastUpdated}</p>
          <div style={{ height: 3, width: 60, background: 'linear-gradient(90deg, #60A5FA, #34D399)', borderRadius: 99, marginTop: '1rem' }} />
        </div>

        <div style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: '2rem', marginBottom: '2rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.8 }}>
            At <strong style={{ color: '#60A5FA' }}>GraduateConnect</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p style={{ marginBottom: '1rem' }}>We collect the following categories of personal data:</p>
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '0 1rem', border: '1px solid rgba(148,163,184,0.1)' }}>
            <DataItem label="Account Information" desc="Full name, email address, password (hashed), and role (Graduate/Employer/Admin)." />
            <DataItem label="Profile Data" desc="University, degree, GPA, field of study, skills, work experience, bio, and profile photo." />
            <DataItem label="CV/Documents" desc="Uploaded CV files and credential documents." />
            <DataItem label="Employment Data" desc="Job applications, cover letters, and application status history." />
            <DataItem label="Usage Data" desc="Pages visited, search queries, and interaction logs for platform improvement." />
            <DataItem label="Technical Data" desc="IP address, browser type, device information, and cookies." />
          </div>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>To create and manage your account and profile.</li>
            <li>To match graduates with relevant job opportunities using our AI algorithm.</li>
            <li>To send application status notifications and platform updates via email.</li>
            <li>To enable employers to discover and contact qualified graduates.</li>
            <li>To improve platform features and user experience.</li>
            <li>To detect and prevent fraud, abuse, and security threats.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do <strong style={{ color: '#E2E8F0' }}>not sell</strong> your personal data. We may share your information with:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong style={{ color: '#E2E8F0' }}>Employers</strong> — Your profile and CV are visible to verified employers when you apply or make your profile public.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Service Providers</strong> — Trusted third parties who help operate our platform (e.g., cloud hosting, email delivery) under strict confidentiality agreements.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Legal Authorities</strong> — When required by law, court order, or to protect the rights and safety of users.</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>All passwords are hashed using Django's PBKDF2 algorithm.</li>
            <li>JWT tokens are used for secure authentication with short expiry times.</li>
            <li>All data transmission is encrypted via HTTPS/TLS.</li>
            <li>Role-based access control (RBAC) limits data access by user role.</li>
            <li>Regular security audits and input validation to prevent SQL injection and XSS.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your personal data for as long as your account is active. If you delete your account:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Your profile and CV are permanently deleted within 30 days.</li>
            <li>Application records may be retained for up to 12 months for legal compliance.</li>
            <li>Anonymized usage data may be retained indefinitely for analytics.</li>
          </ul>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your location, you may have the following rights:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong style={{ color: '#E2E8F0' }}>Access</strong> — Request a copy of your personal data.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Correction</strong> — Update inaccurate or incomplete data via your profile settings.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Deletion</strong> — Request deletion of your account and associated data.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Portability</strong> — Request your data in a machine-readable format.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Objection</strong> — Object to certain types of data processing.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>To exercise these rights, contact us at <a href="mailto:privacy@graduateconnect.com" style={{ color: '#60A5FA' }}>privacy@graduateconnect.com</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use essential cookies for authentication and session management. We do not use third-party advertising cookies. You can control cookie settings through your browser, though disabling essential cookies may affect platform functionality.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>GraduateConnect is not intended for users under 18 years of age. We do not knowingly collect personal data from minors. If we discover that a minor has created an account, we will delete it promptly.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or a prominent notice on the Platform at least 14 days before the changes take effect.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>For privacy-related inquiries or to exercise your rights:</p>
          <div style={{ marginTop: '0.75rem', background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '1rem 1.25rem', border: '1px solid rgba(148,163,184,0.1)' }}>
            <p><strong style={{ color: '#E2E8F0' }}>GraduateConnect Privacy Team</strong></p>
            <p>Email: <a href="mailto:privacy@graduateconnect.com" style={{ color: '#60A5FA' }}>privacy@graduateconnect.com</a></p>
            <p>Response time: Within 30 days of receiving your request.</p>
          </div>
        </Section>
      </div>

      <div style={{ borderTop: '1px solid rgba(148,163,184,0.12)', padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} GraduateConnect. All rights reserved.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
