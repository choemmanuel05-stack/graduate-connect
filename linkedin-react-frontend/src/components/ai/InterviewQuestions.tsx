import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Copy, Check, Lightbulb, Zap } from 'lucide-react';

interface Props {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  graduateSkills?: string;
  degree?: string;
}

interface Question {
  id: string;
  text: string;
  category: 'Technical' | 'Behavioral' | 'Role-Specific' | 'Culture Fit';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tip: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'Technical':     { bg: 'rgba(37,99,235,0.12)',  color: '#93C5FD', border: 'rgba(37,99,235,0.3)' },
  'Behavioral':    { bg: 'rgba(16,185,129,0.12)', color: '#6EE7B7', border: 'rgba(16,185,129,0.3)' },
  'Role-Specific': { bg: 'rgba(139,92,246,0.12)', color: '#C4B5FD', border: 'rgba(139,92,246,0.3)' },
  'Culture Fit':   { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#34D399', Medium: '#F59E0B', Hard: '#EF4444',
};

function generateQuestions(jobTitle: string, skills: string, gradSkills: string, degree: string): Question[] {
  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
  const topSkills = skillList.slice(0, 4);
  const missingSkills = skillList.filter(s => !gradSkills.toLowerCase().includes(s.toLowerCase())).slice(0, 2);

  const questions: Question[] = [];

  // Technical questions based on required skills
  topSkills.forEach((skill, i) => {
    questions.push({
      id: `tech-${i}`,
      text: i === 0
        ? `Can you walk me through a project where you used ${skill}? What challenges did you face and how did you overcome them?`
        : i === 1
        ? `How would you rate your proficiency in ${skill} on a scale of 1–10, and what have you built with it?`
        : `Explain the difference between ${skill} and a similar technology you've worked with.`,
      category: 'Technical',
      difficulty: i === 0 ? 'Medium' : i === 1 ? 'Easy' : 'Hard',
      tip: `Be specific — mention actual projects, code you wrote, or problems you solved. Quantify impact where possible (e.g., "reduced load time by 40%").`,
    });
  });

  if (missingSkills.length > 0) {
    questions.push({
      id: 'tech-gap',
      text: `We use ${missingSkills[0]} heavily in this role. While it's not on your CV, how quickly do you think you could get up to speed, and what's your approach to learning new technologies?`,
      category: 'Technical',
      difficulty: 'Medium',
      tip: `Be honest but confident. Mention a time you learned a new technology quickly. Show enthusiasm for learning.`,
    });
  }

  // Behavioral questions
  questions.push(
    {
      id: 'beh-1',
      text: `Tell me about a time you had to meet a tight deadline. How did you prioritize your work and what was the outcome?`,
      category: 'Behavioral',
      difficulty: 'Medium',
      tip: `Use the STAR method: Situation, Task, Action, Result. Be specific about what YOU did, not the team.`,
    },
    {
      id: 'beh-2',
      text: `Describe a situation where you disagreed with a colleague or supervisor. How did you handle it?`,
      category: 'Behavioral',
      difficulty: 'Medium',
      tip: `Show maturity and professionalism. Focus on the resolution, not the conflict. Demonstrate communication skills.`,
    },
    {
      id: 'beh-3',
      text: `Give an example of a project that didn't go as planned. What went wrong and what did you learn from it?`,
      category: 'Behavioral',
      difficulty: 'Easy',
      tip: `Employers want to see self-awareness and growth mindset. Don't blame others — focus on what you learned.`,
    }
  );

  // Role-specific questions
  questions.push(
    {
      id: 'role-1',
      text: `What do you know about our company and why are you specifically interested in this ${jobTitle} role?`,
      category: 'Role-Specific',
      difficulty: 'Easy',
      tip: `Research the company before the interview. Mention specific products, values, or recent news. Show genuine interest.`,
    },
    {
      id: 'role-2',
      text: `Where do you see yourself in 3–5 years, and how does this ${jobTitle} position fit into that vision?`,
      category: 'Role-Specific',
      difficulty: 'Easy',
      tip: `Align your goals with the company's growth. Show ambition but also commitment to the role.`,
    }
  );

  // Culture fit
  questions.push(
    {
      id: 'culture-1',
      text: `How do you prefer to work — independently or as part of a team? Can you give an example of each?`,
      category: 'Culture Fit',
      difficulty: 'Easy',
      tip: `Most roles need both. Show flexibility. Give a concrete example of each working style.`,
    },
    {
      id: 'culture-2',
      text: `What does your ideal work environment look like, and how do you handle feedback and criticism?`,
      category: 'Culture Fit',
      difficulty: 'Easy',
      tip: `Be honest but professional. Show that you welcome constructive feedback and use it to improve.`,
    }
  );

  return questions;
}

export const InterviewQuestions: React.FC<Props> = ({
  jobTitle, jobDescription, requiredSkills, graduateSkills = '', degree = ''
}) => {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setQuestions(generateQuestions(jobTitle, requiredSkills, graduateSkills, degree));
      setGenerated(true);
      setGenerating(false);
    }, 1200);
  };

  const copy = (q: Question) => {
    navigator.clipboard.writeText(q.text);
    setCopied(q.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const categories = ['All', 'Technical', 'Behavioral', 'Role-Specific', 'Culture Fit'];
  const filtered = filter === 'All' ? questions : questions.filter(q => q.category === filter);

  if (!generated) {
    return (
      <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
          <MessageSquare size={16} style={{ color: '#8B5CF6' }} />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#C4B5FD' }}>Interview Prep</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#BAC8D3', marginBottom: '0.875rem', lineHeight: 1.5 }}>
          Generate tailored interview questions based on this job's requirements and your profile.
        </p>
        <button onClick={generate} disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 8, color: '#C4B5FD', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
          <Zap size={14} />{generating ? 'Generating questions…' : 'Generate Interview Questions'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={15} style={{ color: '#8B5CF6' }} />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#C4B5FD' }}>Interview Questions ({questions.length})</span>
        </div>
        <button onClick={generate} style={{ fontSize: '0.72rem', color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Regenerate</button>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.375rem', overflowX: 'auto' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', border: `1px solid ${filter === c ? 'rgba(139,92,246,0.5)' : 'rgba(148,163,184,0.2)'}`, background: filter === c ? 'rgba(139,92,246,0.15)' : 'transparent', color: filter === c ? '#C4B5FD' : '#64748B' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {filtered.map((q, i) => {
          const cat = CATEGORY_COLORS[q.category];
          const isOpen = expanded === q.id;
          return (
            <div key={q.id} style={{ borderBottom: '1px solid var(--border)', padding: '0.875rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', minWidth: 20, paddingTop: 2 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.5, margin: 0, flex: 1 }}>{q.text}</p>
                    <button onClick={() => copy(q)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === q.id ? '#34D399' : '#64748B', flexShrink: 0, padding: '0.2rem' }}>
                      {copied === q.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.15rem 0.55rem', background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, borderRadius: 99, fontSize: '0.68rem', fontWeight: 700 }}>{q.category}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: DIFFICULTY_COLORS[q.difficulty] }}>● {q.difficulty}</span>
                    <button onClick={() => setExpanded(isOpen ? null : q.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#F59E0B', fontSize: '0.72rem', fontWeight: 600, padding: 0 }}>
                      <Lightbulb size={11} />{isOpen ? 'Hide tip' : 'Show tip'}
                      {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: '0.625rem', padding: '0.625rem 0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
                      <p style={{ fontSize: '0.78rem', color: '#FCD34D', lineHeight: 1.5, margin: 0 }}>💡 {q.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
