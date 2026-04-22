import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{title}</h2>
    <div style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.8 }}>{children}</div>
  </div>
);

const TermsOfUse: React.FC = () => {
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
            Terms of Use
          </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Last updated: {lastUpdated}</p>
          <div style={{ height: 3, width: 60, background: 'linear-gradient(90deg, #60A5FA, #34D399)', borderRadius: 99, marginTop: '1rem' }} />
        </div>

        <div style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: '2rem', marginBottom: '2rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.8 }}>
            Welcome to <strong style={{ color: '#60A5FA' }}>GraduateConnect</strong>. By accessing or using our platform, you agree to be bound by these Terms of Use. Please read them carefully before using our services.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By creating an account or using GraduateConnect ("the Platform"), you confirm that you are at least 18 years old, have read and understood these Terms, and agree to be legally bound by them. If you do not agree, please do not use the Platform.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>GraduateConnect is an online platform that connects university graduates with employment opportunities from companies and industries. The Platform allows:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <li><strong style={{ color: '#E2E8F0' }}>Graduates</strong> to create profiles, upload CVs, and apply for job listings.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Employers</strong> to post job listings, browse graduate profiles, and manage applications.</li>
            <li><strong style={{ color: '#E2E8F0' }}>Administrators</strong> to manage platform content and users.</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Keep your password secure and not share it with third parties.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree NOT to use the Platform to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <li>Post false, misleading, or fraudulent job listings or profiles.</li>
            <li>Harass, discriminate against, or harm other users.</li>
            <li>Upload malicious code, viruses, or harmful content.</li>
            <li>Scrape, harvest, or collect user data without authorization.</li>
            <li>Violate any applicable local, national, or international laws.</li>
            <li>Impersonate any person or organization.</li>
          </ul>
        </Section>

        <Section title="5. Content Ownership">
          <p>You retain ownership of content you submit (CVs, profile information, posts). By submitting content, you grant GraduateConnect a non-exclusive, worldwide, royalty-free license to display and distribute your content solely for the purpose of operating the Platform.</p>
          <p style={{ marginTop: '0.75rem' }}>GraduateConnect owns all intellectual property rights in the Platform, including its design, code, and branding.</p>
        </Section>

        <Section title="6. Job Listings & Applications">
          <p>GraduateConnect does not guarantee employment outcomes. We are not responsible for the accuracy of job listings posted by employers. Employers are solely responsible for their hiring decisions. Graduates are responsible for the accuracy of their profiles and CVs.</p>
        </Section>

        <Section title="7. Termination">
          <p>We reserve the right to suspend or terminate your account at any time if you violate these Terms. You may delete your account at any time through the Settings page. Upon termination, your data will be handled in accordance with our Privacy Policy.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>GraduateConnect is provided "as is" without warranties of any kind. To the maximum extent permitted by law, GraduateConnect shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.</p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>We may update these Terms from time to time. We will notify you of significant changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance of the new Terms.</p>
        </Section>

        <Section title="10. Contact">
          <p>For questions about these Terms, contact us at: <a href="mailto:legal@graduateconnect.com" style={{ color: '#60A5FA' }}>legal@graduateconnect.com</a></p>
        </Section>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(148,163,184,0.12)', padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} GraduateConnect. All rights reserved.
      </div>
    </div>
  );
};

export default TermsOfUse;
