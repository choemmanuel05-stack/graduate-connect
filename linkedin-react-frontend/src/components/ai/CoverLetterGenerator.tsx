import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface Props {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  graduateName: string;
  skills: string;
  university: string;
  degree: string;
  onGenerated?: (letter: string) => void;
}

export const CoverLetterGenerator: React.FC<Props> = ({
  jobTitle, companyName, jobDescription, graduateName, skills, university, degree, onGenerated
}) => {
  const [letter, setLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const skillList = skills.split(',').slice(0, 4).map(s => s.trim()).join(', ');
      const jobSkills = jobDescription.split(' ').filter(w => w.length > 5).slice(0, 3).join(', ');
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const generated = `${today}

Dear Hiring Manager at ${companyName},

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. As a ${degree} graduate in ${university || 'a relevant field'}, I am confident that my academic background and technical expertise make me an excellent candidate for this role.

Throughout my studies and professional development, I have cultivated strong skills in ${skillList}. These competencies align directly with the requirements outlined in your job description, particularly regarding ${jobSkills || 'the core technical requirements'}.

What excites me most about ${companyName} is the opportunity to contribute to meaningful work while continuing to grow professionally. I am particularly drawn to this role because it offers the chance to apply my knowledge in a real-world environment and make a tangible impact.

I am a quick learner, highly motivated, and thrive in collaborative environments. I am confident that I can bring both technical skills and a fresh perspective to your team.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${companyName}'s continued success. Thank you for considering my application.

Sincerely,
${graduateName}`;

      setLetter(generated);
      onGenerated?.(generated);
      setGenerating(false);
    }, 1500);
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button onClick={generate} disabled={generating}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#FCD34D', fontSize: '0.8rem', fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', marginBottom: '0.75rem' }}>
        <Sparkles size={14} /> {generating ? 'Generating cover letter...' : 'AI Generate Cover Letter'}
      </button>

      {letter && (
        <div style={{ position: 'relative' }}>
          <textarea value={letter} onChange={e => setLetter(e.target.value)} rows={12}
            className="field" style={{ fontSize: '0.8rem', lineHeight: 1.7, resize: 'vertical' }} />
          <button onClick={copy}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.625rem', background: 'var(--surface-3)', border: '1px solid var(--border-2)', borderRadius: 6, color: copied ? '#34D399' : '#BAC8D3', fontSize: '0.72rem', cursor: 'pointer' }}>
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};
