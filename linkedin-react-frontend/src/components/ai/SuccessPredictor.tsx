import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Props {
  jobSkills: string;
  graduateSkills: string;
  gpa?: number;
  jobTitle: string;
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const SuccessPredictor: React.FC<Props> = ({ jobSkills, graduateSkills, gpa, jobTitle }) => {
  try {
    const jobList = jobSkills.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    const gradList = graduateSkills.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);

    if (jobList.length === 0) return null;

    const matchedSkills = gradList.filter((g: string) => jobList.some((j: string) => j.includes(g) || g.includes(j)));
    const skillMatch = matchedSkills.length / jobList.length;
    const gpaBonus = gpa ? (gpa >= 3.5 ? 0.15 : gpa >= 3.0 ? 0.10 : 0.05) : 0;

    let score: number;
    if (gradList.length === 0) {
      score = 10 + (hashStr(jobTitle) % 9);
    } else {
      score = Math.max(10, Math.min(95, Math.round((skillMatch * 0.75 + gpaBonus) * 100)));
    }

    const color = score >= 65 ? '#34D399' : score >= 40 ? '#F59E0B' : '#EF4444';
    const label = score >= 65 ? 'High chance' : score >= 40 ? 'Moderate chance' : 'Low chance';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', background: `rgba(${score >= 65 ? '52,211,153' : score >= 40 ? '245,158,11' : '239,68,68'},0.1)`, border: `1px solid rgba(${score >= 65 ? '52,211,153' : score >= 40 ? '245,158,11' : '239,68,68'},0.25)`, borderRadius: 8 }}>
        <TrendingUp size={13} style={{ color }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{score}% success</span>
        <span style={{ fontSize: '0.7rem', color: '#BAC8D3' }}>· {label}</span>
      </div>
    );
  } catch {
    return null;
  }
};
