import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Briefcase, FileText, Calendar, Eye, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { recruiterAPI, jobsAPI } from '../services/api';
import { Card, Badge, Button, EmptyState } from '../components/ui/UIComponents';

const EmployerDashboard = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, shortlisted: 0, interviews: 0 });
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isEmployer = user?.role === 'employer' || user?.role === 'recruiter';
    if (isEmployer) {
      Promise.all([
        recruiterAPI.getStats().catch(() => ({})),
        recruiterAPI.getJobs().catch(() => [])
      ]).then(([s, j]) => {
        setStats(s || {});
        setMyJobs(Array.isArray(j) ? j : []);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || (user.role !== 'employer' && user.role !== 'recruiter')) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem' }}>
          <h2>Employer Access Only</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please log in as an employer or recruiter to view dashboard.</p>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</Link>
        </Card>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await jobsAPI.delete(id);
      setMyJobs(j => j.filter(job => String(job.id) !== String(id)));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Employer <span style={{ color: 'var(--primary)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            Welcome back, {user.name}{user.company ? ` from ${user.company}` : ''}
          </p>
        </div>

        <Link to="/post-job" className="btn btn-primary">
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.activeJobs || myJobs.filter(j => j.status === 'active').length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Job Listings</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.totalApplications || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Applicants</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.shortlisted || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shortlisted Candidates</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.interviews || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interviews Scheduled</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Candidate Funnel */}
      <Card style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', color: 'var(--text-main)' }}>Recruitment Hiring Funnel</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          {[
            { label: 'Applications', val: stats.totalApplications || 0 },
            { label: 'Screened', val: Math.round((stats.totalApplications || 0) * 0.7) },
            { label: 'Shortlisted', val: stats.shortlisted || 0 },
            { label: 'Interview', val: stats.interviews || 0 },
            { label: 'Hired', val: Math.round((stats.interviews || 0) * 0.4) }
          ].map((f, idx) => (
            <div key={idx} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{f.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Postings Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Your Active Job Postings</h3>
        <Link to="/recruiter/jobs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Manage All Jobs</Link>
      </div>

      {myJobs.length === 0 ? (
        <EmptyState
          title="No jobs posted yet"
          description="Create your first job listing to start receiving qualified applicant resumes."
          actionLabel="Post a Job"
          onAction={() => navigate('/post-job')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myJobs.map(job => (
            <Card key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{job.title}</h4>
                  <Badge variant="success">{job.status || 'active'}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {job.location} • {job.type} • Posted {job.posted || 'recently'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
                  <Eye size={14} /> View
                </Link>
                <Button variant="danger" size="sm" onClick={() => handleDelete(job.id)}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
