#!/usr/bin/env python3
"""Write AI components: AIChatbot, InterviewQuestions, JobDescriptionScorer"""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def write(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {rel_path} ({len(content)} chars)")

# ─── TASK 3: AIChatbot.tsx ────────────────────────────────────────────────────
CHATBOT = r"""import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, ThumbsUp, ThumbsDown, Minimize2, Maximize2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
  reactions?: { up: boolean; down: boolean };
  quickReplies?: string[];
}

interface ConversationContext {
  lastTopic: string;
  history: Array<{ role: 'user' | 'bot'; text: string }>;
}

// ─── Intent detection ────────────────────────────────────────────────────────
const INTENTS: Array<{ patterns: RegExp[]; handler: (ctx: ConversationContext, user: any) => { text: string; quickReplies?: string[] } }> = [
  {
    patterns: [/\b(hello|hi|hey|howdy|greetings)\b/i],
    handler: (_, user) => ({
      text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your GraduateConnect AI assistant. How can I help you today?`,
      quickReplies: ['Find jobs', 'Build my CV', 'Improve profile', 'How matching works'],
    }),
  },
  {
    patterns: [/\b(find|search|look|browse).*(job|work|position|role|career)\b/i, /\bjob.*(find|search)\b/i],
    handler: () => ({
      text: `To find jobs that match your profile:\n\n**1.** Go to the **Jobs** page\n**2.** Use the search bar to filter by title or skills\n**3.** Check **Recommended for You** — AI-matched to your skills\n\n💡 Tip: Keep your skills updated for better matches!`,
      quickReplies: ['How does matching work?', 'Improve my profile', 'Apply for a job'],
    }),
  },
  {
    patterns: [/\b(cv|resume|curriculum)\b/i],
    handler: () => ({
      text: `Build a professional CV right here! 📄\n\nGo to **CV Builder** to:\n• Fill in your experience and education\n• Choose from **3 templates** (Classic, Modern, Minimal)\n• Use **AI Generate** for your summary\n• Download as PDF\n\nYour CV is shared with employers when you apply.`,
      quickReplies: ['Open CV Builder', 'Download PDF tips', 'AI summary help'],
    }),
  },
  {
    patterns: [/\b(apply|application|applied|applying)\b/i],
    handler: () => ({
      text: `To apply for a job:\n\n**1.** Browse jobs on the **Jobs** page\n**2.** Click **Apply** on any listing\n**3.** Optionally add a cover letter (use AI Generate!)\n**4.** Submit your application\n\nTrack all applications under **My Applications**. 📋`,
      quickReplies: ['Track my applications', 'Write cover letter', 'Interview tips'],
    }),
  },
  {
    patterns: [/\b(profile|improve|stand out|visibility)\b/i],
    handler: () => ({
      text: `Tips to improve your profile:\n\n✅ Add all your skills (more = better matches)\n✅ Upload or build your CV\n✅ Write a compelling bio\n✅ Add LinkedIn and GitHub links\n✅ Set availability to **"Open to Work"**\n\nA complete profile gets **3x more views** from employers!`,
      quickReplies: ['Build my CV', 'Add skills', 'How matching works'],
    }),
  },
  {
    patterns: [/\b(match|score|recommend|compatible|fit)\b/i],
    handler: () => ({
      text: `Our AI matching system scores compatibility based on:\n\n• **Skills overlap** — 40 points\n• **Degree relevance** — 20 points\n• **GPA** — 20 points\n• **Field of study** — 20 points\n\nThe higher your score, the more likely you are to be shortlisted! 🏆\n\nWe use **semantic matching** — so "React" also matches "ReactJS" and "React.js".`,
      quickReplies: ['Improve my score', 'Find matching jobs', 'Update my skills'],
    }),
  },
  {
    patterns: [/\b(interview|prepare|preparation|question)\b/i],
    handler: () => ({
      text: `Preparing for interviews? 🎯\n\nUse our **Interview Question Generator** to get:\n• Technical questions based on the job's required skills\n• Behavioral (STAR-format) questions\n• Role-specific questions\n• Tips on how to answer each one\n\nGo to **Interview Prep** in the menu to get started!`,
      quickReplies: ['Open Interview Prep', 'STAR method tips', 'Common questions'],
    }),
  },
  {
    patterns: [/\b(cover letter|covering letter)\b/i],
    handler: () => ({
      text: `Generate a professional cover letter with AI! ✍️\n\nWhen applying for a job:\n**1.** Click **Apply**\n**2.** Click **AI Generate** in the cover letter section\n**3.** The AI uses your profile + the job description\n**4.** Edit and personalize it\n\nA tailored cover letter can significantly boost your chances!`,
      quickReplies: ['Apply for a job', 'Profile tips', 'CV Builder'],
    }),
  },
  {
    patterns: [/\b(employer|company|post|hiring|recruit)\b/i],
    handler: () => ({
      text: `For employers on GraduateConnect:\n\n• **Post job listings** from your Dashboard\n• **Browse graduate profiles** with AI matching\n• **View CVs** and credentials\n• **Shortlist** and contact candidates\n• Use the **Job Description Scorer** to optimize your listings\n\nGo to your **Employer Dashboard** to get started.`,
      quickReplies: ['Post a job', 'Score job description', 'Browse graduates'],
    }),
  },
  {
    patterns: [/\b(password|account|login|logout|email|settings)\b/i],
    handler: () => ({
      text: `For account issues:\n• Change password in **Settings**\n• Update email in **Settings**\n• If locked out, use **"Forgot Password"** on the login page\n\nNeed more help? Contact **support@graduateconnect.com**`,
      quickReplies: ['Open Settings', 'Contact support'],
    }),
  },
  {
    patterns: [/\b(thank|thanks|thank you|cheers)\b/i],
    handler: (_, user) => ({
      text: `You're welcome, ${user?.fullName?.split(' ')[0] || 'there'}! 😊 Feel free to ask me anything else. Good luck with your job search! 🚀`,
      quickReplies: ['Find jobs', 'Build my CV'],
    }),
  },
  {
    patterns: [/\b(help|what can you|what do you|capabilities)\b/i],
    handler: () => ({
      text: `I can help you with:\n\n🔍 **Finding jobs** — search tips and recommendations\n📄 **CV building** — create a professional CV\n📝 **Applications** — apply and track applications\n👤 **Profile tips** — stand out to employers\n🤖 **AI features** — cover letters, skill gap analysis\n📊 **Match scores** — understand your compatibility\n🎯 **Interview prep** — practice questions\n\nJust ask me anything!`,
      quickReplies: ['Find jobs', 'Build my CV', 'Interview prep', 'Match scores'],
    }),
  },
];

function detectIntent(input: string, ctx: ConversationContext, user: any): { text: string; quickReplies?: string[] } {
  const q = input.toLowerCase();

  // Context-aware follow-ups
  if (ctx.lastTopic === 'jobs' && /\b(how|where|when)\b/i.test(q)) {
    return {
      text: `To apply: go to **Jobs**, find a listing you like, and click **Apply**. You can add a cover letter and the AI will help you write one. Your profile and CV are automatically included.`,
      quickReplies: ['Track applications', 'Write cover letter'],
    };
  }

  for (const intent of INTENTS) {
    if (intent.patterns.some(p => p.test(q))) {
      return intent.handler(ctx, user);
    }
  }

  return {
    text: `I'm not sure about that, but I'm here to help! Try asking about:\n• Finding jobs\n• Building your CV\n• Improving your profile\n• Understanding match scores\n\nOr type **help** to see everything I can do. 😊`,
    quickReplies: ['Find jobs', 'Build my CV', 'Help'],
  };
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} style={{ color: '#93C5FD', fontWeight: 700 }}>{part}</strong> : part
    );
    // Bullet
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <div key={i} style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.15rem' }}><span style={{ color: '#60A5FA', flexShrink: 0 }}>•</span><span>{rendered.slice(1)}</span></div>;
    }
    // Numbered
    if (/^\*\*\d+\.\*\*/.test(line) || /^\d+\./.test(line)) {
      return <div key={i} style={{ marginBottom: '0.15rem' }}>{rendered}</div>;
    }
    if (line === '') return <div key={i} style={{ height: '0.4rem' }} />;
    return <div key={i} style={{ marginBottom: '0.1rem' }}>{rendered}</div>;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen]         = useState(false);
  const [minimized, setMin]     = useState(false);
  const [unread, setUnread]     = useState(0);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const [ctx, setCtx]           = useState<ConversationContext>({ lastTopic: '', history: [] });
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'bot',
    text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your GraduateConnect AI assistant. How can I help you today?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: ['Find jobs', 'Build my CV', 'Improve profile', 'How matching works'],
  }]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    if (!minimized) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, minimized]);

  const send = useCallback((text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user', text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(p => [...p, userMsg]);

    const newCtx: ConversationContext = {
      lastTopic: ctx.lastTopic,
      history: [...ctx.history, { role: 'user', text: msg }].slice(-10),
    };

    setTyping(true);
    const response = detectIntent(msg, newCtx, user);
    const delay = 600 + Math.min(response.text.length * 8, 1400);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'bot', text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: response.quickReplies,
        reactions: { up: false, down: false },
      };
      setMessages(p => [...p, botMsg]);
      setCtx({ lastTopic: msg.toLowerCase(), history: [...newCtx.history, { role: 'bot', text: response.text }].slice(-10) });
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, delay);
  }, [input, ctx, user, open]);

  const react = (id: string, type: 'up' | 'down') => {
    setMessages(p => p.map(m => m.id === id ? { ...m, reactions: { up: type === 'up', down: type === 'down' } } : m));
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(0); }}
        aria-label="Open AI assistant"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,99,235,0.55)', zIndex: 1000,
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.7)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.55)'; }}
      >
        {open ? <X size={20} color="white" /> : <MessageCircle size={20} color="white" />}
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, background: '#EF4444', borderRadius: 99, fontSize: '0.65rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 4px', border: '2px solid var(--bg)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem',
          width: 360, height: minimized ? 56 : 500,
          background: 'var(--surface)', border: '1px solid var(--border-2)',
          borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', transition: 'height 250ms ease',
          animation: 'popIn 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => setMin(m => !m)}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white', margin: 0 }}>GC Assistant</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                {typing ? 'Typing...' : 'AI-powered · Always here'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399' }} />
              {minimized ? <Maximize2 size={14} color="rgba(255,255,255,0.7)" /> : <Minimize2 size={14} color="rgba(255,255,255,0.7)" />}
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {messages.map(msg => (
                  <div key={msg.id}>
                    <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.5rem', alignItems: 'flex-end' }}>
                      {msg.role === 'bot' && (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={12} color="white" />
                        </div>
                      )}
                      <div style={{ maxWidth: '82%' }}>
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : 'var(--surface-2)',
                          color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                          fontSize: '0.8rem', lineHeight: 1.55,
                        }}>
                          {msg.role === 'bot' ? renderMarkdown(msg.text) : msg.text}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.2rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <p style={{ fontSize: '0.62rem', color: '#64748B' }}>{msg.time}</p>
                          {msg.role === 'bot' && msg.reactions && (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button onClick={() => react(msg.id, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', opacity: msg.reactions.up ? 1 : 0.4 }}>
                                <ThumbsUp size={10} color={msg.reactions.up ? '#34D399' : '#64748B'} />
                              </button>
                              <button onClick={() => react(msg.id, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', opacity: msg.reactions.down ? 1 : 0.4 }}>
                                <ThumbsDown size={10} color={msg.reactions.down ? '#EF4444' : '#64748B'} />
                              </button>
                            </div>
                          )}
                        </div>
                        {/* Quick replies */}
                        {msg.role === 'bot' && msg.quickReplies && msg.id === messages[messages.length - 1]?.id && !typing && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.375rem' }}>
                            {msg.quickReplies.map(qr => (
                              <button key={qr} onClick={() => send(qr)}
                                style={{ padding: '0.2rem 0.6rem', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 99, color: '#60A5FA', fontSize: '0.68rem', cursor: 'pointer', transition: 'all 150ms ease' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}>
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

                {/* Typing indicator */}
                {typing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={12} color="white" />
                    </div>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--surface-2)', borderRadius: '14px 14px 14px 2px', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask me anything..."
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || typing}
                  style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !typing ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : 'var(--surface-3)', border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease', flexShrink: 0 }}>
                  <Send size={14} color={input.trim() && !typing ? 'white' : '#64748B'} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </>
  );
};
"""

write('src/components/ai/AIChatbot.tsx', CHATBOT)
print("AIChatbot.tsx done")
