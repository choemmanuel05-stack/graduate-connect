import React, { useState } from 'react';
import { BarChart2, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface ScoreCategory {
  name: string;
  score: number;
  max: number;
  color: string;
  feedback: string[];
}

interface ScorerResult {
  overall: number;
  categories: ScoreCategory[];
  flaggedPhrases: { phrase: string; reason: string }[];
  suggestions: string[];
}

// Biased / problematic phrases to flag
const BIASED_PHRASES = [
  { phrase: 'rockstar', reason: 'Informal language that may deter qualified candidates' },
  { phrase: 'ninja', reason: 'Informal language that may deter qualified candidates' },
  { phrase: 'guru', reason: 'Informal language that may deter qualified candidates' },
  { phrase: 'wizard', reason: 'Informal language that may deter qualified candidates' },
  { phrase: 'young', reason: 'Age-related language that may be discriminatory' },
  { phrase: 'energetic', reason: 'Can imply age bias' },
  { phrase: 'digital native', reason: 'Implies age preference' },
  { phrase: 'must have 10+ years', reason: 'Overly restrictive — consider if truly necessary' },
  { phrase: 'must have 15+ years', reason: 'Overly restrictive — consider if truly necessary' },
  { phrase: 'native speaker', reason: 'May exclude qualified non-native speakers' },
  { phrase: 'fast-paced', reason: 'Vague — describe the actual work environment instead' },
  { phrase: 'self-starter', reason: 'Overused buzzword — describe what independence looks like in this role' },
  { phrase: 'passionate', reason: 'Overused — focus on skills and responsibilities instead' },
];

function scoreDescription(text: string): ScorerResult {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // ── Clarity (0–25) ────────────────────────────────────────────────────
  let clarity = 0;
  const clarityFeedback: string[] = [];
  if (wordCount >= 100) { clarity += 8; } else { clarityFeedback.push('Description is too short — aim for at least 100 words'); }
  if (wordCount <= 600) { clarity += 5; } else { clarityFeedback.push('Description may be too long — consider trimming to under 600 words'); }
  if (lower.includes('responsibilities') || lower.includes('duties') || lower.includes('you will')) { clarity += 6; } else { clarityFeedback.push('Add a clear "Responsibilities" section describing day-to-day tasks'); }
  if (lower.includes('requirements') || lower.includes('qualifications') || lower.includes('you have')) { clarity += 6; } else { clarityFeedback.push('Add a clear "Requirements" or "Qualifications" section'); }
  if (clarityFeedback.length === 0) clarityFeedback.push('Role is clearly defined with responsibilities and requirements');

  // ── Completeness (0–25) ───────────────────────────────────────────────
  let completeness = 0;
  const completeFeedback: string[] = [];
  if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay') || lower.includes('fcfa') || lower.includes('$')) { completeness += 7; } else { completeFeedback.push('Consider adding salary range — it increases application rates by 30%'); }
  if (lower.includes('benefit') || lower.includes('insurance') || lower.includes('leave') || lower.includes('remote')) { completeness += 6; } else { completeFeedback.push('Mention benefits (health insurance, leave days, remote work options)'); }
  if (lower.includes('deadline') || lower.includes('apply by') || lower.includes('closing date')) { completeness += 4; } else { completeFeedback.push('Add an application deadline to create urgency'); }
  if (lower.includes('about us') || lower.includes('about the company') || lower.includes('our company') || lower.includes('we are')) { completeness += 8; } else { completeFeedback.push('Add a brief "About Us" section — candidates want to know who they\'re joining'); }
  if (completeFeedback.length === 0) completeFeedback.push('Job listing is comprehensive with all key sections');

  // ── Inclusivity (0–25) ────────────────────────────────────────────────
  let inclusivity = 20;
  const inclusiveFeedback: string[] = [];
  const flagged = BIASED_PHRASES.filter(p => lower.includes(p.phrase.toLowerCase()));
  if (flagged.length > 0) {
    inclusivity -= flagged.length * 4;
    flagged.forEach(p => inclusiveFeedback.push(`"${p.phrase}" — ${p.reason}`));
  }
  if (lower.includes('equal opportunity') || lower.includes('diversity') || lower.includes('inclusive')) { inclusivity += 5; } else { inclusiveFeedback.push('Consider adding an equal opportunity statement'); }
  inclusivity = Math.max(0, Math.min(25, inclusivity));
  if (inclusiveFeedback.length === 0) inclusiveFeedback.push('No biased language detected — great job!');

  // ── Attractiveness (0–25) ─────────────────────────────────────────────
  let attractiveness = 0;
  const attractFeedback: string[] = [];
  if (lower.includes('growth') || lower.includes('career') || lower.includes('develop') || lower.includes('learn')) { attractiveness += 7; } else { attractFeedback.push('Mention career growth and learning opportunities'); }
  if (lower.includes('team') || lower.includes('culture') || lower.includes('environment') || lower.includes('collaborate')) { attractiveness += 6; } else { attractFeedback.push('Describe the team culture and work environment'); }
  if (lower.includes('impact') || lower.includes('mission') || lower.includes('purpose') || lower.includes('meaningful')) { attractiveness += 6; } else { attractFeedback.push('Highlight the impact and purpose of the role'); }
  if (lower.includes('flexible') || lower.includes('hybrid') || lower.includes('remote') || lower.includes('work from home')) { attractiveness += 6; } else { attractFeedback.push('Mention work flexibility if applicable (remote/hybrid options)'); }
  if (attractFeedback.length === 0) attractFeedback.push('Job description is compelling and attractive to candidates');

  const overall = Math.round((clarity + completeness + inclusivity + attractiveness) / 100 * 100);

  const suggestions: string[] = [];
  if (clarity < 18) suggestions.push('Structure your description with clear headings: About the Role, Responsibilities, Requirements, Benefits');
  if (completeness < 18) suggestions.push('Add salary range and benefits — listings with these get 2x more applications');
  if (inclusivity < 18) suggestions.push('Review language for bias and add an equal opportunity statement');
  if (attractiveness < 18) suggestions.push('Emphasize growth opportunities, team culture, and the impact of the role');
  if (wordCount < 150) suggestions.push('Expand your description — aim for 200–400 words for optimal engagement');

  return {
    overall,
    categories: [
      { name: 'Clarity', score: clarity, max: 25, color: '#60A5FA', feedback: clarityFeedback },
      { name: 'Completeness', score: completeness, max: 25, color: '#34D399', feedback: completeFeedback },
      { name: 'Inclusivity', score: inclusivity, max: 25, color: '#F59E0B', feedback: inclusiveFeedback },
      { name: 'Attractiveness', score: attractiveness, max: 25, color: '#C4B5FD', feedback: attractFeedback },
    ],
    flaggedPhrases: flagged,
    suggestions,
  };
}

interface Props {
  initialText?: string;
  compact?: boolean;
}

export const JobDescriptionScorer: React.FC<Props> = ({ initialText = '', compact = false }) => {
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState<ScorerResult | null>(null);
  const [scoring, setScoring] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const score = () => {
    if (!text.trim()) return;
    setScoring(true);
    setTimeout(() => {
      setResult(scoreDescription(text));
      setScoring(false);
    }, 800);
  };

  const overallColor = result
    ? result.overall >= 75 ? '#34D399' : result.overall >= 50 ? '#F59E0B' : '#EF4444'
    : '#64748B';

  const overallLabel = result
    ? result.overall >= 75 ? 'Strong' : result.overall >= 50 ? 'Needs Work' : 'Weak'
    : '';

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart2 size={15} style={{ color: '#34D399' }} />
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#6EE7B7' }}>Job Description Scorer</span>
      </div>

      <div style={{ padding: '1rem' }}>
        {!compact && (
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.375rem' }}>
              Paste your job description
            </label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={6}
              placeholder="Paste your job description here to get an AI-powered quality score and improvement suggestions…"
              style={{ width: '100%', padding: '0.625rem 0.75rem', background: '#263348', border: '1.5px solid rgba(148,163,184,0.25)', borderRadius: 8, fontSize: '0.85rem', color: '#F1F5F9', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
          </div>
        )}

        <button onClick={score} disabled={scoring || !text.trim()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.125rem', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, color: '#34D399', fontSize: '0.85rem', fontWeight: 700, cursor: text.trim() ? 'pointer' : 'not-allowed', opacity: text.trim() ? 1 : 0.5, marginBottom: result ? '1rem' : 0 }}>
          <BarChart2 size={14} />{scoring ? 'Analyzing…' : result ? 'Re-score' : 'Score Description'}
        </button>

        {result && (
          <div>
            {/* Overall score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'var(--surface-3)', borderRadius: 10, marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={overallColor} strokeWidth="3"
                    strokeDasharray={`${result.overall} ${100 - result.overall}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: overallColor, lineHeight: 1 }}>{result.overall}</span>
                  <span style={{ fontSize: '0.55rem', color: '#64748B' }}>/100</span>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1rem', color: overallColor, margin: 0 }}>{overallLabel}</p>
                <p style={{ fontSize: '0.78rem', color: '#BAC8D3', margin: '0.2rem 0 0' }}>Overall job description quality</p>
                {result.flaggedPhrases.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.4rem' }}>
                    <AlertTriangle size={12} style={{ color: '#F59E0B' }} />
                    <span style={{ fontSize: '0.72rem', color: '#FCD34D' }}>{result.flaggedPhrases.length} phrase{result.flaggedPhrases.length > 1 ? 's' : ''} flagged</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
              {result.categories.map(cat => {
                const pct = Math.round((cat.score / cat.max) * 100);
                const isOpen = expanded === cat.name;
                return (
                  <div key={cat.name} style={{ background: 'var(--surface-3)', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setExpanded(isOpen ? null : cat.name)}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', minWidth: 90, textAlign: 'left' }}>{cat.name}</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: 99, transition: 'width 600ms ease' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cat.color, minWidth: 40, textAlign: 'right' }}>{cat.score}/{cat.max}</span>
                      {isOpen ? <ChevronUp size={13} style={{ color: '#64748B' }} /> : <ChevronDown size={13} style={{ color: '#64748B' }} />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 0.75rem 0.75rem' }}>
                        {cat.feedback.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            {pct >= 70
                              ? <CheckCircle size={12} style={{ color: '#34D399', flexShrink: 0, marginTop: 2 }} />
                              : <XCircle size={12} style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }} />}
                            <span style={{ fontSize: '0.75rem', color: '#BAC8D3', lineHeight: 1.5 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div style={{ padding: '0.75rem', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8 }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.5rem' }}>
                  <Lightbulb size={12} /> Top Suggestions
                </p>
                {result.suggestions.map((s, i) => (
                  <p key={i} style={{ fontSize: '0.75rem', color: '#BAC8D3', lineHeight: 1.5, marginBottom: '0.3rem' }}>• {s}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
