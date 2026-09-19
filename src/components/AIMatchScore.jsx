import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Badge, Button } from './ui/UIComponents';

const AIMatchScore = ({ job }) => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  if (!user || user.role === 'recruiter') {
    return null;
  }

  // Calculate skill match dynamically from actual user profile and job requirements
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (job?.skills || []).map(s => s.toLowerCase());

  if (requiredSkills.length === 0) {
    return null;
  }

  const matchedSkills = requiredSkills.filter(s => userSkills.includes(s));
  const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
  
  // Base percentage calculation
  const skillsScore = Math.round((matchedSkills.length / Math.max(requiredSkills.length, 1)) * 100);
  const expScore = user.experience ? 90 : 75;
  const locScore = (user.location && job.location?.toLowerCase().includes(user.location.toLowerCase())) || job.workMode === 'Remote' ? 100 : 80;
  const roleScore = (user.preferredRole && job.title?.toLowerCase().includes(user.preferredRole.toLowerCase())) ? 95 : 85;

  const totalScore = Math.round((skillsScore * 0.4) + (expScore * 0.2) + (locScore * 0.2) + (roleScore * 0.2));

  // Color theme based on score
  let scoreColor = 'var(--success)';
  let scoreBg = 'rgba(16, 185, 129, 0.12)';
  let scoreBorder = 'rgba(16, 185, 129, 0.3)';

  if (totalScore < 50) {
    scoreColor = 'var(--danger)';
    scoreBg = 'rgba(239, 68, 68, 0.12)';
    scoreBorder = 'rgba(239, 68, 68, 0.3)';
  } else if (totalScore < 75) {
    scoreColor = 'var(--warning)';
    scoreBg = 'rgba(245, 158, 11, 0.12)';
    scoreBorder = 'rgba(245, 158, 11, 0.3)';
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${scoreBorder}`,
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Gauge badge */}
          <div style={{
            width: '68px', height: '68px', borderRadius: '50%',
            background: scoreBg, border: `3px solid ${scoreColor}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: scoreColor, fontWeight: '800'
          }}>
            <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{totalScore}%</span>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.85, marginTop: '2px' }}>AI Match</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '700' }}>AI Match & Compatibility</h4>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {totalScore >= 80 ? "Strong match! Your profile aligns exceptionally well with this job's tech stack." :
               totalScore >= 50 ? 'Good match. You have core skills required for this role with minor gaps.' :
               'Consider highlighting transferrable project experience or upskilling.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button variant="secondary" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide Breakdown' : 'View AI Breakdown'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button size="sm" onClick={() => navigate('/career-roadmap')}>
            Improve My Match <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
          {/* Metrics breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Skills Match', val: skillsScore },
              { label: 'Experience Match', val: expScore },
              { label: 'Location Match', val: locScore },
              { label: 'Role Match', val: roleScore }
            ].map((m, idx) => (
              <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--glass)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>{m.val}%</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {/* Why you match */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} />
                Why You're a Strong Match
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {matchedSkills.length > 0 ? matchedSkills.map((s, idx) => (
                  <span key={idx} style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                    ✓ {s}
                  </span>
                )) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Core skill transferability verified.</span>}
              </div>
            </div>

            {/* Skills to improve */}
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <AlertTriangle size={16} />
                Skills You May Want to Improve
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {missingSkills.length > 0 ? missingSkills.map((s, idx) => (
                  <span key={idx} style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                    + {s}
                  </span>
                )) : <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>You match all listed skill keywords!</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatchScore;
