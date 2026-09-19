import React from 'react';
import { TrendingUp, Award, DollarSign, BarChart2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui/UIComponents';

const TOP_SKILLS = [
  { name: 'React.js / Next.js', percentage: 92, category: 'Frontend' },
  { name: 'Python & Data Analysis', percentage: 86, category: 'Data & AI' },
  { name: 'Node.js & Express APIs', percentage: 81, category: 'Backend' },
  { name: 'AWS & Cloud Architecture', percentage: 76, category: 'DevOps' },
  { name: 'TypeScript', percentage: 72, category: 'Languages' },
  { name: 'SQL & Database Design', percentage: 68, category: 'Database' }
];

const SALARY_BENCHMARKS = [
  { role: 'Frontend Engineer', junior: '$75k - $95k', mid: '$110k - $140k', senior: '$150k - $190k' },
  { role: 'Full Stack Engineer', junior: '$80k - $105k', mid: '$120k - $155k', senior: '$165k - $210k' },
  { role: 'Data Scientist / ML', junior: '$90k - $115k', mid: '$135k - $170k', senior: '$180k - $240k' },
  { role: 'DevOps & Cloud Engineer', junior: '$85k - $110k', mid: '$125k - $160k', senior: '$170k - $220k' }
];

const CareerInsights = () => {
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
          <TrendingUp size={16} /> Market Data & Compensation Trends
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Career <span style={{ color: 'var(--primary)' }}>Insights</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto' }}>
          Data-driven market intelligence to help you target high-growth roles, negotiate compensation, and prioritize in-demand skills.
        </p>
      </div>

      {/* Top Skills Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BarChart2 size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Top In-Demand Skills</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {TOP_SKILLS.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{skill.name}</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{skill.percentage}% demand</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '6px', background: 'var(--glass-border)', overflow: 'hidden' }}>
                  <div style={{ width: `${skill.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Recommendations */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Lightbulb size={20} color="var(--warning)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Recommended Upskilling</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { skill: 'TypeScript', reason: 'Included in 78% of senior frontend position listings.' },
              { skill: 'Next.js & SSR', reason: 'High demand for full-stack web applications.' },
              { skill: 'Docker Containerization', reason: 'Essential for DevOps and backend system scaling.' },
              { skill: 'GraphQL APIs', reason: 'Fastest growing API skill across tech startups.' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.skill}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Salary Benchmarks */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <DollarSign size={20} color="var(--success)" />
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Salary Compensation Benchmarks</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Junior (0-2 yrs)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Mid-Level (3-5 yrs)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Senior (5+ yrs)</th>
              </tr>
            </thead>
            <tbody>
              {SALARY_BENCHMARKS.map((bench, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.925rem' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>{bench.role}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{bench.junior}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{bench.mid}</td>
                  <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: '600' }}>{bench.senior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CareerInsights;
