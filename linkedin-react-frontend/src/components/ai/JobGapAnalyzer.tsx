import React, { useState } from 'react';
import { Target, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface Props {
  jobSkills: string;
  graduateSkills: string;
  jobTitle: string;
}

export const JobGapAnalyzer: React.FC<Props> = ({ jobSkills, graduateSkills, jobTitle }) => {
  const [analyzed, setAnalyzed] = useState(false);

  const jobSkillList = jobSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const gradSkillList = graduateSkills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  const matched = jobSkillList.filter(s => gradSkillList.some(g => g.includes(s) || s.includes(g)));
  const missing = jobSkillList.filter(s => !gradSkillList.some(g => g.includes(s) || s.includes(g)));
  const extra = gradSkillList.filter(s => !jobSkillList.some(j => j.includes(s) || s.includes(j)));

  const score = jobSkillList.length > 0 ? Math.round((matched.length / jobSkillList.length) * 100) : 0;

  const scoreColor = score >= 70 ? '#34D399' : score >= 40 ? '#F59E0B' : '#EF4444';
  const scoreLabel = score >= 70 ? 'Strong Match' : score >= 40 ? 'Partial Match' : 'Weak Match';

  return (
    <div>
      {!analyzed ? (
        <button onClick={() => setAnalyzed(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 8, color: '#60A5FA', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
          <Target size={14} /> Analyze Skill Gap
        </button>
      ) : (
        <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '1rem', border: '1px solid var(--border)' }}>
          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface-3)', borderRadius: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `conic-gradient(${scoreColor} ${score}%, var(--surface) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: scoreColor }}>
                {score}%
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: scoreColor, fontSize: '0.9rem' }}>{scoreLabel}</p>
              <p style={{ fontSize: '0.75rem', color: '#BAC8D3' }}>for {jobTitle}</p>
            </div>
          </div>

          {/* Matched skills */}
          {matched.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#34D399', marginBottom: '0.375rem' }}>
                <CheckCircle size={12} /> You have ({matched.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {matched.map(s => <span key={s} style={{ padding: '0.15rem 0.5rem', background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 99, fontSize: '0.7rem' }}>{s}</span>)}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {missing.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', marginBottom: '0.375rem' }}>
                <XCircle size={12} /> Missing ({missing.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {missing.map(s => <span key={s} style={{ padding: '0.15rem 0.5rem', background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 99, fontSize: '0.7rem' }}>{s}</span>)}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {missing.length > 0 && (
            <div style={{ padding: '0.625rem 0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#FCD34D', marginBottom: '0.25rem' }}>
                <TrendingUp size={12} /> Recommendation
              </p>
              <p style={{ fontSize: '0.72rem', color: '#BAC8D3', lineHeight: 1.5 }}>
                Focus on learning <strong style={{ color: '#FCD34D' }}>{missing.slice(0, 2).join(' and ')}</strong> to significantly improve your match score. Consider online courses or personal projects to build these skills.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
