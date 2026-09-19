import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Briefcase, MapPin, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Badge, Button, EmptyState } from '../components/ui/UIComponents';

const FOLDERS = ['All Saved', 'Frontend', 'AI / ML', 'Internships'];

const SavedJobs = () => {
  const { user, savedJobs = [], unsaveJob } = useApp();
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState('All Saved');

  const handleUnsave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await unsaveJob(jobId);
    } catch (err) {
      console.error('Error unsaving job:', err);
    }
  };

  if (!user || user.role !== 'candidate') {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem' }}>
          <h2>Candidate Access Only</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in as a candidate to view saved jobs.</p>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</Link>
        </Card>
      </div>
    );
  }

  const filteredJobs = activeFolder === 'All Saved'
    ? savedJobs
    : savedJobs.filter(j => j.category?.toLowerCase().includes(activeFolder.toLowerCase()) || j.type?.toLowerCase().includes(activeFolder.toLowerCase()));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Saved <span style={{ color: 'var(--primary)' }}>Opportunities</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} bookmarked in your career space
          </p>
        </div>

        <Link to="/compare-jobs" className="btn btn-secondary">
          Compare Saved Jobs
        </Link>
      </div>

      {/* Folder Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {FOLDERS.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '50px',
              background: activeFolder === folder ? 'var(--primary-light)' : 'var(--glass)',
              border: `1px solid ${activeFolder === folder ? 'rgba(99, 102, 241, 0.3)' : 'var(--glass-border)'}`,
              color: activeFolder === folder ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
            }}
          >
            {folder}
          </button>
        ))}
      </div>

      {filteredJobs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredJobs.map(job => (
            <Card
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: '260px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: '800', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {job.company?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{job.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14} /> {job.location}</span>
                    <span style={{ color: 'var(--success)', fontWeight: '700' }}>{job.salary}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <Badge variant="neutral">{job.type}</Badge>
                    {job.workMode && <Badge variant="primary">{job.workMode}</Badge>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Button variant="danger" size="sm" onClick={(e) => handleUnsave(e, job.id)}>
                  <Trash2 size={14} /> Unsave
                </Button>
                <Button size="sm">
                  Apply Now <ArrowRight size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved jobs in this folder"
          description="Save jobs while browsing to compare compensation and apply at your convenience."
          actionLabel="Explore Open Jobs"
          onAction={() => navigate('/jobs')}
        />
      )}
    </div>
  );
};

export default SavedJobs;
