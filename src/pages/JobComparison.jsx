import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Check, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Button, Badge } from '../components/ui/UIComponents';

const JobComparison = () => {
  const { savedJobs = [], jobs = [], user } = useApp();

  // If savedJobs is populating, find full job objects
  const availableJobs = savedJobs.length > 0
    ? savedJobs
    : jobs.slice(0, 3); // Fallback sample comparison

  const [selectedIds, setSelectedIds] = useState(() => availableJobs.slice(0, 3).map(j => j.id || j.jobId));

  const compareJobs = availableJobs.filter(j => selectedIds.includes(j.id || j.jobId));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--primary-light)', color: 'var(--primary)',
          padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem',
          fontWeight: '600', marginBottom: '1rem'
        }}>
          <Scale size={16} /> Side-by-Side Analysis
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Compare <span style={{ color: 'var(--primary)' }}>Opportunities</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Compare compensation, work mode, requirements, and AI Match scores to make informed career moves.
        </p>
      </div>

      {compareJobs.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <Scale size={32} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3>No jobs selected for comparison</h3>
          <p style={{ color: 'var(--text-muted)' }}>Save jobs or browse listings to compare opportunities side-by-side.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'separate', borderSpacing: '0',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)',
            background: 'var(--bg-card)'
          }}>
            <thead>
              <tr style={{ background: 'var(--glass)' }}>
                <th style={{ padding: '1.25rem', textAlign: 'left', minWidth: '180px', color: 'var(--text-muted)', fontSize: '0.9rem', borderBottom: '1px solid var(--glass-border)' }}>
                  Criteria
                </th>
                {compareJobs.map((job, idx) => (
                  <th key={idx} style={{ padding: '1.25rem', textAlign: 'left', minWidth: '240px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '700' }}>{job.title}</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>{job.company}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)' }}>
                  Salary Range
                </td>
                {compareJobs.map((job, idx) => (
                  <td key={idx} style={{ padding: '1rem 1.25rem', color: 'var(--success)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)' }}>
                    {job.salary || 'Competitive'}
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)' }}>
                  Location & Work Mode
                </td>
                {compareJobs.map((job, idx) => (
                  <td key={idx} style={{ padding: '1rem 1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ fontWeight: '500' }}>{job.location}</div>
                    <Badge variant="primary" size="sm">{job.workMode || 'Remote'}</Badge>
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)' }}>
                  Employment Type
                </td>
                {compareJobs.map((job, idx) => (
                  <td key={idx} style={{ padding: '1rem 1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)' }}>
                    {job.type}
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)' }}>
                  Required Skills
                </td>
                {compareJobs.map((job, idx) => (
                  <td key={idx} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {(job.skills || ['JavaScript', 'React']).map((skill, sIdx) => (
                        <span key={sIdx} style={{ background: 'var(--glass)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Action
                </td>
                {compareJobs.map((job, idx) => (
                  <td key={idx} style={{ padding: '1.25rem' }}>
                    <Link to={`/jobs/${job.id || job.jobId}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobComparison;
