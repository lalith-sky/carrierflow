import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronDown, Sparkles } from 'lucide-react';

const QUESTION_TEMPLATES = {
  'Frontend Developer': { skills: ['React', 'JavaScript', 'CSS', 'TypeScript'], questions: [
    { q: 'Explain the virtual DOM in React and how it improves performance.', level: 'Intermediate', type: 'Technical' },
    { q: 'What is the difference between controlled and uncontrolled components?', level: 'Intermediate', type: 'Technical' },
    { q: 'How does React fiber architecture work?', level: 'Advanced', type: 'Technical' },
    { q: 'Explain CSS specificity and how the cascade works.', level: 'Basic', type: 'Technical' },
    { q: 'What strategies do you use for optimizing web performance?', level: 'Advanced', type: 'Technical' },
    { q: 'Describe a challenging bug you fixed and your debugging process.', level: 'Intermediate', type: 'Behavioral' },
    { q: 'How do you handle state management in large React applications?', level: 'Advanced', type: 'System Design' },
    { q: 'Tell me about a time you had to learn a new technology quickly.', level: 'Basic', type: 'Behavioral' },
  ]},
  'Backend Developer': { skills: ['Node.js', 'Python', 'SQL', 'APIs'], questions: [
    { q: 'Explain REST vs GraphQL and when you\'d choose each.', level: 'Intermediate', type: 'Technical' },
    { q: 'How do you handle database migrations in production?', level: 'Advanced', type: 'Technical' },
    { q: 'What is the N+1 query problem and how do you solve it?', level: 'Intermediate', type: 'Technical' },
    { q: 'Design a rate limiting system for an API.', level: 'Advanced', type: 'System Design' },
    { q: 'Explain the difference between SQL and NoSQL databases.', level: 'Basic', type: 'Technical' },
    { q: 'How do you ensure API security?', level: 'Intermediate', type: 'Technical' },
    { q: 'Describe your approach to error handling and logging.', level: 'Intermediate', type: 'Technical' },
    { q: 'Tell me about a system you designed from scratch.', level: 'Advanced', type: 'Behavioral' },
  ]},
  'Data Scientist': { skills: ['Python', 'ML', 'Statistics', 'SQL'], questions: [
    { q: 'Explain the bias-variance tradeoff.', level: 'Intermediate', type: 'Technical' },
    { q: 'What is cross-validation and why is it important?', level: 'Basic', type: 'Technical' },
    { q: 'How do you handle imbalanced datasets?', level: 'Intermediate', type: 'Technical' },
    { q: 'Explain the difference between L1 and L2 regularization.', level: 'Advanced', type: 'Technical' },
    { q: 'Design a recommendation system for an e-commerce platform.', level: 'Advanced', type: 'System Design' },
    { q: 'What metrics would you use to evaluate a classification model?', level: 'Intermediate', type: 'Technical' },
    { q: 'How do you communicate complex technical findings to non-technical stakeholders?', level: 'Basic', type: 'Behavioral' },
    { q: 'Walk me through a machine learning project you completed.', level: 'Intermediate', type: 'Behavioral' },
  ]},
  'Product Manager': { skills: ['Strategy', 'Analytics', 'Communication'], questions: [
    { q: 'How do you prioritize features on a product roadmap?', level: 'Intermediate', type: 'Technical' },
    { q: 'Describe your approach to gathering user requirements.', level: 'Basic', type: 'Behavioral' },
    { q: 'How do you measure the success of a product feature?', level: 'Intermediate', type: 'Technical' },
    { q: 'Tell me about a product decision that didn\'t go as planned.', level: 'Advanced', type: 'Behavioral' },
    { q: 'How do you handle competing priorities from stakeholders?', level: 'Intermediate', type: 'Behavioral' },
    { q: 'Design a new feature for a food delivery app.', level: 'Advanced', type: 'System Design' },
  ]},
};

const LEVEL_BADGE = { Basic: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };
const TYPE_BADGE = { Technical: 'badge-primary', Behavioral: 'badge-info', 'System Design': 'badge-neutral' };

const AIInterviewPrep = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showAnswers, setShowAnswers] = useState({});

  const roles = Object.keys(QUESTION_TEMPLATES);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={24} color="var(--primary)" /> AI Interview Preparation</h1>
        <p>Practice with role-specific interview questions</p>
      </div>

      {/* Role Selection */}
      <div className="glass-card-static" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Select a Role</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {roles.map(role => (
            <button key={role} onClick={() => setSelectedRole(role)} style={{
              padding: '1.25rem', borderRadius: 'var(--radius-lg)',
              border: `2px solid ${selectedRole === role ? 'var(--primary)' : 'var(--glass-border)'}`,
              background: selectedRole === role ? 'var(--primary-light)' : 'transparent',
              color: selectedRole === role ? 'white' : 'var(--text-muted)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}>
              <Briefcase size={18} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '0.95rem' }}>{role}</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{QUESTION_TEMPLATES[role].questions.length} questions</p>
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      {selectedRole && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>{selectedRole} Interview Questions</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {QUESTION_TEMPLATES[selectedRole].skills.map(s => <span key={s} className="badge-skill">{s}</span>)}
            </div>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {QUESTION_TEMPLATES[selectedRole].questions.map((q, i) => (
              <div key={i} className="glass-card-static" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.1rem' }}>Q{i + 1}</span>
                    <h4 style={{ fontSize: '1rem', lineHeight: '1.5' }}>{q.q}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                    <span className={`badge ${LEVEL_BADGE[q.level]}`}>{q.level}</span>
                    <span className={`badge ${TYPE_BADGE[q.type]}`}>{q.type}</span>
                  </div>
                </div>
                <button onClick={() => setShowAnswers(s => ({ ...s, [i]: !s[i] }))} className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
                  {showAnswers[i] ? 'Hide Tips' : 'Show Tips'} <ChevronDown size={12} style={{ transform: showAnswers[i] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {showAnswers[i] && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                    <p><strong>Tips:</strong></p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                      <li>Structure your answer clearly with examples</li>
                      <li>Use the STAR method for behavioral questions</li>
                      <li>Mention specific technologies and quantify results</li>
                      <li>Be prepared for follow-up questions on this topic</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterviewPrep;
