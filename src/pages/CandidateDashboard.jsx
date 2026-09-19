import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Heart, FileText, Calendar, Bell, ChevronRight, CheckCircle2, User, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Badge, Button, Alert } from '../components/ui/UIComponents';

const CandidateDashboard = () => {
  const { user, applications = [], savedJobs = [], notifications = [], jobs = [] } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem' }}>
          <h3>Please log in to view your Candidate Dashboard</h3>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</Link>
        </Card>
      </div>
    );
  }

  // Pipeline count
  const shortlistedApps = applications.filter(a => a.status === 'shortlisted');
  const interviewApps = applications.filter(a => a.status === 'interview');
  const profilePercent = 85; // Calculated profile score

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
            Good morning, {user.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            Here's what's happening with your career application pipeline.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/profile" className="btn btn-secondary">
            <User size={16} /> Edit Profile
          </Link>
          <Link to="/jobs" className="btn btn-primary">
            Explore Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <Card style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>Profile Completeness</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              Your profile is {profilePercent}% complete
            </div>
          </div>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            Complete Profile (+15%)
          </Link>
        </div>
        <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--glass-border)', marginTop: '0.75rem', overflow: 'hidden' }}>
          <div style={{ width: `${profilePercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
        </div>
      </Card>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{applications.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applications</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{shortlistedApps.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shortlisted</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{interviewApps.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interviews</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{savedJobs.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Saved Jobs</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Application Pipeline Stage */}
      <Card style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', color: 'var(--text-main)' }}>Application Pipeline Workflow</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          {[
            { stage: 'Applied', count: applications.length, active: true },
            { stage: 'Screening', count: applications.filter(a => a.status === 'reviewing').length, active: true },
            { stage: 'Shortlisted', count: shortlistedApps.length, active: shortlistedApps.length > 0 },
            { stage: 'Interview', count: interviewApps.length, active: interviewApps.length > 0 },
            { stage: 'Offer / Hired', count: applications.filter(a => a.status === 'accepted').length, active: false }
          ].map((step, idx) => (
            <div key={idx} style={{
              padding: '1rem 0.5rem', borderRadius: 'var(--radius-md)',
              background: step.active ? 'var(--primary-light)' : 'var(--glass)',
              border: `1px solid ${step.active ? 'rgba(99, 102, 241, 0.3)' : 'var(--glass-border)'}`
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: step.active ? 'var(--primary)' : 'var(--text-muted)' }}>{step.count}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.2rem' }}>{step.stage}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommended Jobs & Applications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recommended Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" /> Recommended for You
            </h3>
            <Link to="/jobs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.slice(0, 3).map((job) => (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{job.title}</h4>
                  <Badge variant="primary">{job.type}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{job.company} • {job.location}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700' }}>{job.salary}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--secondary)" /> Recent Applications
            </h3>
            <Link to="/applications" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>View Pipeline</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>You haven't submitted any applications yet.</p>
                <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Find Jobs</Link>
              </Card>
            ) : (
              applications.slice(0, 3).map((app) => (
                <Card key={app.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{app.jobTitle}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.company}</div>
                    </div>
                    <Badge variant={app.status === 'shortlisted' ? 'success' : 'primary'}>
                      {app.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
