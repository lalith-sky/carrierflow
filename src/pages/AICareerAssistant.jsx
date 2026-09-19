import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, User, Sparkles, Briefcase, FileText, GraduationCap } from 'lucide-react';
import { useApp } from '../context/JobContext';

const SUGGESTIONS = [
  'Which jobs match my skills?',
  'What skills should I learn for frontend development?',
  'How can I improve my resume?',
  'Prepare me for a React developer interview.',
  'What are the top in-demand tech skills?',
  'How do I negotiate a higher salary?'
];

// Simple AI response generator (no external API needed)
const generateResponse = (message, userProfile) => {
  const lower = message.toLowerCase();
  if (lower.includes('skills') && (lower.includes('learn') || lower.includes('should'))) {
    return `Based on current industry trends, here are skills worth learning:\n\n**High Demand Skills:**\n• TypeScript & React/Next.js\n• Python & Machine Learning\n• Cloud (AWS/GCP/Azure)\n• Docker & Kubernetes\n• System Design\n\n**Emerging Skills:**\n• AI/LLM Integration\n• Rust & WebAssembly\n• Edge Computing\n\nI'd recommend focusing on skills that complement your current expertise. Would you like specific learning resources for any of these?`;
  }
  if (lower.includes('resume') || lower.includes('cv')) {
    return `Here are key tips to improve your resume:\n\n**Structure:**\n• Keep it 1-2 pages maximum\n• Use a clean, ATS-friendly format\n• Lead with a strong professional summary\n\n**Content:**\n• Quantify achievements (e.g., "Improved load time by 40%")\n• Use action verbs (Built, Led, Designed, Optimized)\n• Tailor keywords to job descriptions\n• Include relevant projects and tech stack\n\n**Common Mistakes:**\n• Avoid generic objectives\n• Don't list every technology you've ever used\n• Proofread for typos\n\nWould you like me to analyze your resume in the Resume Analyzer tool?`;
  }
  if (lower.includes('interview') || lower.includes('prepare')) {
    return `Here's how to prepare for a tech interview:\n\n**Technical Preparation:**\n• Review data structures & algorithms\n• Practice coding on LeetCode/HackerRank\n• Prepare system design answers\n• Review your past projects in detail\n\n**Behavioral Preparation:**\n• Use the STAR method for behavioral questions\n• Prepare 5-6 stories from your experience\n• Research the company thoroughly\n\n**Day of Interview:**\n• Test your setup (camera, mic, internet)\n• Have water and notes ready\n• Ask thoughtful questions at the end\n\nCheck out our **AI Interview Prep** tool for role-specific practice questions!`;
  }
  if (lower.includes('match') || lower.includes('job') && lower.includes('my')) {
    return `To find the best job matches, I recommend:\n\n1. **Complete your profile** - Add all your skills, experience, and preferences\n2. **Browse by category** - Filter jobs by your primary skill area\n3. **Use filters** - Set work mode, experience level, and location preferences\n4. **Check match scores** - Jobs will show AI match percentages based on your profile\n\nThe more complete your profile is, the better our matching algorithm works. Head to your **Profile** page to update your skills and preferences!`;
  }
  if (lower.includes('salary') || lower.includes('negotiate') || lower.includes('pay')) {
    return `**Salary Negotiation Tips:**\n\n• Research market rates on Glassdoor, Levels.fyi, and LinkedIn\n• Know your worth based on skills and experience\n• Let the employer make the first offer\n• Consider total compensation (equity, benefits, bonus)\n• Be confident but professional\n• Have a target range, not a fixed number\n• Get the offer in writing before accepting\n\n**Average Ranges (US):**\n• Junior Dev: $70k-$100k\n• Mid-level: $100k-$150k\n• Senior: $150k-$200k+\n• Staff/Principal: $200k-$350k+\n\nRanges vary significantly by location and company.`;
  }
  return `That's a great question! Here are some thoughts:\n\n${message.length > 20 ? 'Based on your query, I\'d recommend exploring our job listings and using the filters to narrow down opportunities. ' : ''}You can also:\n\n• **Browse Jobs** - Use our advanced search and filters\n• **Complete Your Profile** - Better profiles get better recommendations\n• **Upload Your Resume** - Get AI-powered feedback\n• **Practice Interviews** - Use our interview prep tool\n\nIs there anything specific about your career journey I can help with?`;
};

const AICareerAssistant = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi${user ? ` ${user.name}` : ''}! 👋 I'm your CareerFlow AI Assistant. I can help you with:\n\n• Finding jobs that match your skills\n• Resume improvement tips\n• Interview preparation\n• Career advice and skill recommendations\n\nHow can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: text }]);
    setTyping(true);
    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const response = generateResponse(text, null);
    setMessages(m => [...m, { role: 'assistant', content: response }]);
    setTyping(false);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={24} color="var(--primary)" /> AI Career Assistant</h1>
        <p>Your personal career advisor powered by AI</p>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="var(--primary)" />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
              background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--glass)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
              whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.7'
            }}>
              {msg.content.split('\n').map((line, j) => {
                if (line.startsWith('**') && line.endsWith('**')) return <strong key={j} style={{ display: 'block', marginTop: j > 0 ? '0.5rem' : 0 }}>{line.replace(/\*\*/g, '')}</strong>;
                if (line.startsWith('• ')) return <div key={j} style={{ paddingLeft: '0.5rem', color: msg.role === 'user' ? 'white' : 'var(--text-muted)' }}>• {line.slice(2)}</div>;
                return <div key={j}>{line || <br />}</div>;
              })}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: '700' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="var(--primary)" />
            </div>
            <div style={{ padding: '1rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => handleSend(s)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <input className="form-input" placeholder="Ask me anything about your career..." value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: '0.85rem 1rem' }} />
        <button type="submit" className="btn btn-primary" disabled={!input.trim() || typing}><Send size={18} /></button>
      </form>
    </div>
  );
};

export default AICareerAssistant;
