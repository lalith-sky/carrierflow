import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, Sparkles, BookOpen, Award, Layers } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui/UIComponents';

const ROADMAPS = {
  'Frontend Developer': {
    description: 'Master modern web interfaces, component architecture, state management, and performance.',
    levels: [
      {
        title: 'Beginner Foundations',
        skills: [
          { name: 'HTML5 & Semantic Markup', completed: true },
          { name: 'CSS3, Flexbox & CSS Grid', completed: true },
          { name: 'JavaScript Fundamentals (ES6+)', completed: true },
          { name: 'Git & Version Control', completed: true },
        ]
      },
      {
        title: 'Intermediate Core Skills',
        skills: [
          { name: 'React.js & Hooks Architecture', completed: true },
          { name: 'REST APIs & Fetch/Axios', completed: true },
          { name: 'TypeScript Type Safety', completed: false },
          { name: 'Tailwind CSS / CSS Modules', completed: true },
        ]
      },
      {
        title: 'Advanced Mastery',
        skills: [
          { name: 'Next.js (App Router & SSR)', completed: false },
          { name: 'State Management (Zustand/Redux)', completed: false },
          { name: 'Testing (Jest & React Testing Library)', completed: false },
          { name: 'Web Vitals & Performance Optimization', completed: false },
        ]
      }
    ]
  },

  'Full Stack Engineer': {
    description: 'Build complete web applications from database architecture to responsive client interfaces.',
    levels: [
      {
        title: 'Core Fundamentals',
        skills: [
          { name: 'JavaScript & Node.js Basics', completed: true },
          { name: 'Express.js REST API Design', completed: true },
          { name: 'SQL & Database Design (PostgreSQL)', completed: true },
        ]
      },
      {
        title: 'Full Stack Integration',
        skills: [
          { name: 'React / Frontend Frameworks', completed: true },
          { name: 'JWT Auth & Security Best Practices', completed: true },
          { name: 'ORM Integration (Prisma / Sequelize)', completed: false },
        ]
      },
      {
        title: 'System Architecture',
        skills: [
          { name: 'Docker & Containerization', completed: false },
          { name: 'CI/CD Pipelines (GitHub Actions)', completed: false },
          { name: 'Cloud Deployment (AWS / Vercel)', completed: false },
        ]
      }
    ]
  }
};

const CareerRoadmap = () => {
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const currentRoadmap = ROADMAPS[selectedRole];

  // Calculate total progress
  const allSkills = currentRoadmap.levels.flatMap(l => l.skills);
  const completedCount = allSkills.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / allSkills.length) * 100);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--primary-light)', color: 'var(--primary)',
          padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem',
          fontWeight: '600', marginBottom: '1rem'
        }}>
          <Compass size={16} /> Interactive Skill Progression
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Career <span style={{ color: 'var(--primary)' }}>Roadmap</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Step-by-step skill progression tailored to modern tech roles. Track your milestones and unlock top employer recommendations.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {Object.keys(ROADMAPS).map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${selectedRole === role ? 'var(--primary)' : 'var(--glass-border)'}`,
              background: selectedRole === role ? 'var(--primary-light)' : 'var(--glass)',
              color: selectedRole === role ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Progress Card */}
      <Card style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-main)' }}>{selectedRole} Mastery Track</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{currentRoadmap.description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{progressPercent}%</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{completedCount} of {allSkills.length} Skills Completed</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '10px', borderRadius: '10px', background: 'var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.4s ease' }} />
        </div>
      </Card>

      {/* Milestone Levels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
        {currentRoadmap.levels.map((level, idx) => (
          <Card key={idx} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.95rem'
              }}>
                0{idx + 1}
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{level.title}</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {level.skills.map((skill, sIdx) => (
                <div key={sIdx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                  background: skill.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--glass)',
                  border: `1px solid ${skill.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass-border)'}`
                }}>
                  <span style={{ fontSize: '0.9rem', color: skill.completed ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: skill.completed ? '600' : '400' }}>
                    {skill.name}
                  </span>
                  {skill.completed ? (
                    <CheckCircle2 size={18} color="var(--success)" />
                  ) : (
                    <Circle size={18} color="var(--text-dim)" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerRoadmap;
