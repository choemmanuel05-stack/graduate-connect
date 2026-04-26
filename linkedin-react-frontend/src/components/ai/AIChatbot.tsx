import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
  reactions?: { up: boolean; down: boolean };
  quickReplies?: string[];
}

// ── Intent detection ──────────────────────────────────────────────────────────
function detectIntent(input: string): string {
  const q = input.toLowerCase();
  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(q)) return 'greeting';
  if (/\b(job|find job|search job|look for work|vacancy|opening)\b/.test(q)) return 'find_job';
  if (/\b(cv|resume|curriculum vitae|build cv|create cv)\b/.test(q)) return 'cv';
  if (/\b(apply|application|how to apply|submit)\b/.test(q)) return 'apply';
  if (/\b(profile|improve profile|update profile|complete profile)\b/.test(q)) return 'profile';
  if (/\b(match|score|matching|compatibility|recommend)\b/.test(q)) return 'matching';
  if (/\b(employer|company|post job|hire|hiring)\b/.test(q)) return 'employer';
  if (/\b(credential|certificate|verify|verification|upload)\b/.test(q)) return 'credential';
  if (/\b(interview|prepare|question|practice)\b/.test(q)) return 'interview';
  if (/\b(skill|gap|missing skill|learn)\b/.test(q)) return 'skills';
  if (/\b(password|account|login|sign in|forgot)\b/.test(q)) return 'account';
  if (/\b(thank|thanks|thank you)\b/.test(q)) return 'thanks';
  if (/\b(help|what can you|what do you do|capabilities)\b/.test(q)) return 'help';
  if (/\b(salary|pay|compensation|wage)\b/.test(q)) return 'salary';
  if (/\b(notification|alert|email)\b/.test(q)) return 'notification';
  return 'unknown';
}

function getResponse(intent: string, input: string, user: any, history: Message[]): { text: string; quickReplies?: string[] } {
  const name = user?.fullName?.split(' ')[0] || 'there';
  const role = user?.role || 'graduate';

  // Check context from last bot message
  const lastBot = [...history].reverse().find(m => m.role === 'bot');
  const lastIntent = lastBot?.text?.includes('CV') ? 'cv_context' : '';

  switch (intent) {
    case 'greeting':
      return {
        text: `Hi ${name}! 👋 I'm your GraduateConnect AI assistant. I'm here to help you with job searching, CV building, applications, and more.\n\nWhat can I help you with today?`,
        quickReplies: role === 'graduate'
          ? ['Find jobs for me', 'Build my CV', 'Improve my profile', 'How does matching work?']
          : ['Post a job', 'Find candidates', 'How does matching work?', 'Help'],
      };

    case 'find_job':
      return {
        text: `Here's how to find the best jobs on GraduateConnect:\n\n🔍 **Browse Jobs** — Go to the Jobs page and use filters (job type, skills, location)\n\n⭐ **Recommended for You** — The top of the Jobs page shows AI-matched jobs based on your profile skills\n\n📊 **Match Score** — Each job shows your compatibility percentage\n\n💡 **Pro tip:** The more complete your profile, the better your job recommendations!`,
        quickReplies: ['How do I improve my match score?', 'How do I apply?', 'Update my skills'],
      };

    case 'cv':
      return {
        text: `GraduateConnect has a built-in **AI-powered CV Builder** 🎨\n\nGo to **CV Builder** in the navigation to:\n\n✅ Choose from 3 professional templates (Classic, Modern, Minimal)\n✅ Pick your accent color\n✅ Fill in your details step-by-step\n✅ Use **AI Generate** to write your professional summary\n✅ Download as PDF instantly\n\nYour CV auto-saves as you type!`,
        quickReplies: ['Open CV Builder', 'What templates are available?', 'How do I download my CV?'],
      };

    case 'apply':
      return {
        text: `Applying for a job is simple:\n\n1️⃣ Go to **Jobs** and find a position you like\n2️⃣ Click **Apply** on the job card\n3️⃣ Optionally add a cover letter (use **AI Generate** for help!)\n4️⃣ Submit — your match score is calculated automatically\n\nTrack all your applications under **My Applications** 📋\n\nYou'll see status updates: Applied → Shortlisted → Interviewed`,
        quickReplies: ['Track my applications', 'What is a match score?', 'Generate a cover letter'],
      };

    case 'profile':
      return {
        text: `A complete profile gets **3x more views** from employers! Here's what to fill in:\n\n✅ Full name, photo, and contact info\n✅ Professional title (e.g., "Software Engineer")\n✅ Skills — add as many as possible (comma-separated)\n✅ Work experience with descriptions\n✅ Education details with GPA\n✅ Upload a verified credential\n✅ Set availability to "Open to work"\n\nGo to **Profile** in the navigation to update yours.`,
        quickReplies: ['How do I upload a credential?', 'What skills should I add?', 'How does verification work?'],
      };

    case 'matching':
      return {
        text: `Our AI matching algorithm scores your compatibility with jobs on a **0–100 scale**:\n\n📊 **GPA** — 40 points (proportional to job requirement)\n🎓 **Degree type** — 20 points (exact match)\n🏫 **Specialization** — 20 points (word overlap)\n🛠️ **Skills** — 20 points (semantic matching)\n\nThe skills component uses **synonym matching** — so "Python" matches "Django", "ML" matches "Machine Learning", etc.\n\nHigher score = more likely to be shortlisted! 🏆`,
        quickReplies: ['How do I improve my score?', 'What skills should I add?', 'View my applications'],
      };

    case 'employer':
      return {
        text: `As an employer on GraduateConnect, you can:\n\n📝 **Post Jobs** — Go to Dashboard → Post a Job\n🔍 **Search Candidates** — Filter by degree, GPA, skills, specialization\n📊 **View Match Scores** — See how well each candidate fits your role\n✅ **Manage Applications** — Shortlist, interview, or reject candidates\n📧 **Email Notifications** — Candidates are notified of status changes\n\nTip: Use the **Job Description Scorer** to optimize your listings!`,
        quickReplies: ['How do I post a job?', 'How do I find candidates?', 'What is the Job Description Scorer?'],
      };

    case 'credential':
      return {
        text: `Credentials are academic certificates that verify your qualifications:\n\n📤 **Upload** — Go to Profile → Upload Credential\n📄 **Accepted formats** — PDF, JPEG, PNG (max 5MB)\n⏳ **Review** — An administrator reviews your document\n✅ **Verified badge** — Appears on your profile once approved\n\n**Why it matters:** Employers can only find you in candidate searches if you have at least one verified credential!`,
        quickReplies: ['How long does verification take?', 'What documents can I upload?', 'View my profile'],
      };

    case 'interview':
      return {
        text: `GraduateConnect has an **Interview Prep** feature! 🎯\n\nWhen you apply for a job, click **Interview Questions** to get:\n\n❓ **Technical questions** based on required skills\n🧠 **Behavioral questions** (STAR format)\n🎯 **Role-specific questions** tailored to the job\n💡 **Answer tips** for each question\n\nPractice these before your interview to boost your confidence!`,
        quickReplies: ['How do I apply for a job?', 'What is the STAR method?', 'Improve my profile'],
      };

    case 'skills':
      return {
        text: `Skills are the most important factor in job matching! Here's how to optimize:\n\n🛠️ **Add all your skills** — even soft skills like "Communication" and "Leadership"\n🔗 **Use standard names** — "Python" not "python programming"\n📈 **Skill gap analysis** — When applying, click "Analyze Skill Gap" to see what you're missing\n🎯 **Focus on missing skills** — The gap analyzer shows exactly what to learn\n\nOur AI understands synonyms — "JS" matches "JavaScript", "ML" matches "Machine Learning"!`,
        quickReplies: ['Update my skills', 'How does skill matching work?', 'Find jobs matching my skills'],
      };

    case 'salary':
      return {
        text: `Salary information on GraduateConnect:\n\n💰 Employers can optionally list salary ranges (in FCFA)\n📊 You can filter jobs by salary range on the Jobs page\n🤝 Salary negotiation tips:\n   • Research market rates for your role\n   • Consider your GPA and experience level\n   • Don't accept the first offer — it's normal to negotiate\n\nFor Cameroon, entry-level tech roles typically range from 150,000–400,000 FCFA/month.`,
        quickReplies: ['Find high-paying jobs', 'Improve my profile', 'How do I apply?'],
      };

    case 'account':
      return {
        text: `For account-related issues:\n\n🔑 **Change password** — Go to Settings\n📧 **Update email** — Go to Settings\n👤 **Update profile** — Go to Profile\n🔒 **Forgot password** — Use the "Forgot Password" link on the login page\n\nNeed more help? Contact **support@graduateconnect.com**`,
        quickReplies: ['Go to Settings', 'Update my profile', 'Help'],
      };

    case 'thanks':
      return {
        text: `You're welcome, ${name}! 😊 Good luck with your job search! 🚀\n\nFeel free to ask me anything else — I'm always here to help.`,
        quickReplies: ['Find jobs', 'Build my CV', 'Help'],
      };

    case 'help':
      return {
        text: `Here's everything I can help you with:\n\n🔍 **Job Search** — Finding and filtering jobs\n📄 **CV Builder** — Creating a professional CV\n📝 **Applications** — How to apply and track status\n👤 **Profile** — Optimizing your profile\n📊 **Match Scores** — Understanding compatibility\n🎯 **Interview Prep** — Practice questions\n🛠️ **Skills** — Gap analysis and recommendations\n💼 **Employers** — Posting jobs and finding candidates\n\nJust ask me anything!`,
        quickReplies: ['Find jobs', 'Build my CV', 'How does matching work?', 'Interview prep'],
      };

    default: {
      // Context-aware fallback
      const suggestions = role === 'graduate'
        ? ['Find jobs', 'Build my CV', 'Improve my profile', 'Interview prep']
        : ['Post a job', 'Find candidates', 'Help'];
      return {
        text: `I'm not sure about that specific question, but I'm here to help! 😊\n\nTry asking me about finding jobs, building your CV, improving your profile, or understanding match scores.`,
        quickReplies: suggestions,
      };
    }
  }
}

// ── Markdown-like renderer ────────────────────────────────────────────────────
function renderText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} style={{ color: '#F1F5F9' }}>{part}</strong> : part
    );
    return <React.Fragment key={i}>{rendered}{i < lines.length - 1 && <br />}</React.Fragment>;
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', role: 'bot',
      text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your GraduateConnect AI assistant. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: user?.role === 'graduate'
        ? ['Find jobs for me', 'Build my CV', 'Improve my profile', 'How does matching work?']
        : ['Post a job', 'Find candidates', 'Help'],
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only show when logged in
  if (!user) return null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const send = useCallback((text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user', text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 600 + Math.min(msg.length * 8, 1200);
    setTimeout(() => {
      const intent = detectIntent(msg);
      const { text: responseText, quickReplies } = getResponse(intent, msg, user, messages);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'bot', text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies,
        reactions: { up: false, down: false },
      };
      setMessages(p => [...p, botMsg]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, delay);
  }, [input, user, messages, open]);

  const react = (id: string, type: 'up' | 'down') => {
    setMessages(p => p.map(m => m.id === id
      ? { ...m, reactions: { up: type === 'up', down: type === 'down' } }
      : m
    ));
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => { setOpen(!open); setMinimized(false); }}
        aria-label="Open AI assistant"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,99,235,0.5)', zIndex: 1000, transition: 'transform 200ms ease' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        {open ? <X size={20} color="white" /> : <MessageCircle size={20} color="white" />}
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, background: '#EF4444', borderRadius: 99, fontSize: '0.65rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 4px', border: '2px solid var(--bg)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* AI label — always visible above the button */}
      {!open && (
        <span style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem',
          fontSize: '0.65rem', fontWeight: 700, color: '#F1F5F9',
          background: 'rgba(37,99,235,0.85)', backdropFilter: 'blur(6px)',
          padding: '0.2rem 0.55rem', borderRadius: 99,
          border: '1px solid rgba(96,165,250,0.4)',
          letterSpacing: '0.03em', pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}>
          AI Assistant
        </span>
      )}

      {/* Chat window */}
      {open && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '1.5rem', width: 340, height: minimized ? 52 : 500, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'height 250ms ease', animation: 'popIn 0.2s ease' }}>
          {/* Header */}
          <div style={{ padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white', margin: 0 }}>GC Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>AI-powered · Always here</p>
              </div>
            </div>
            <button onClick={() => setMinimized(!minimized)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '0.25rem' }}>
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '0.25rem' }}>
              <X size={14} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {messages.map(msg => (
                  <div key={msg.id}>
                    <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.5rem', alignItems: 'flex-end' }}>
                      {msg.role === 'bot' && (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={12} color="white" />
                        </div>
                      )}
                      <div style={{ maxWidth: '82%' }}>
                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: msg.role === 'user' ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'var(--surface-2)', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.55 }}>
                          {renderText(msg.text)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.2rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <p style={{ fontSize: '0.62rem', color: '#64748B' }}>{msg.time}</p>
                          {msg.role === 'bot' && msg.reactions && (
                            <>
                              <button onClick={() => react(msg.id, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem', color: msg.reactions.up ? '#34D399' : '#64748B' }}><ThumbsUp size={10} /></button>
                              <button onClick={() => react(msg.id, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem', color: msg.reactions.down ? '#EF4444' : '#64748B' }}><ThumbsDown size={10} /></button>
                            </>
                          )}
                        </div>
                        {/* Quick replies */}
                        {msg.role === 'bot' && msg.quickReplies && msg.id === messages[messages.length - 1]?.id && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {msg.quickReplies.map(qr => (
                              <button key={qr} onClick={() => send(qr)}
                                style={{ padding: '0.2rem 0.6rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 99, color: '#60A5FA', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 500 }}>
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={12} style={{ color: '#BAC8D3' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={12} color="white" />
                    </div>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--surface-2)', borderRadius: '12px 12px 12px 2px', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask me anything…"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={() => send()} disabled={!input.trim()}
                  style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'var(--surface-3)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}>
                  <Send size={14} color={input.trim() ? 'white' : '#64748B'} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </>
  );
};
