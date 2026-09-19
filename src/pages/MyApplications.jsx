import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, CheckCircle, Clock, XCircle, Calendar, Briefcase } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { applicationsAPI } from '../services/api';

const getStatusStyle = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'shortlisted' || s === 'selected' || s === 'accepted') {
    return { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.12)', label: status };
  }
  if (s === 'interview') {
    return { color: 'var(--primary)', bg: 'var(--primary-light)', label: status };
  }
  if (s === 'reviewing' || s === 'under review') {
    return { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.12)', label: status };
  }
  if (s === 'rejected') {
    return { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.12)', label: status };
  }
  return { color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.12)', label: status || 'Applied' };
};

const MyApplications = () => {
  const { user } = useApp();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicationsAPI.getAll();
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchApps();
  }, [user]);

  if (!user) return <div className="page-container empty-state"><h2>Please sign in</h2><Link to="/auth" className="btn btn-primary">Sign In</Link></div>;
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          My Applications
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
          Tracking {apps.length} {apps.length === 1 ? 'application' : 'applications'}
        </p>
      </div>

      {apps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {apps.map(app => {
            const conf = getStatusStyle(app.status);
            return (
              <div key={app.id} className="glass-card-static" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Briefcase size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>{app.jobTitle}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>{app.company}</p>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        Applied on {new Date(app.date || app.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.4rem 0.9rem', borderRadius: '50px',
                      background: conf.bg, color: conf.color, fontSize: '0.85rem', fontWeight: '700',
                      textTransform: 'capitalize'
                    }}>
                      <CheckCircle size={14} /> {conf.label}
                    </span>
                    <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} /> View Job
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
          <FileText size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>No applications yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start applying to open positions matching your skill set.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Find Jobs</Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
