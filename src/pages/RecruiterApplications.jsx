import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, User, Eye } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { applicationsAPI } from '../services/api';

const STATUSES = ['All', 'applied', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'];

const RecruiterApplications = () => {
  const { user } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let active = true;
    if (user?.role === 'employer' || user?.role === 'recruiter') {
      applicationsAPI.getAll().then(data => {
        if (active) {
          setApplications(Array.isArray(data) ? data : data?.applications || []);
          setLoading(false);
        }
      }).catch(err => {
        console.error('Error fetching applications:', err);
        if (active) setLoading(false);
      });
    }
    return () => { active = false; };
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationsAPI.update(id, { status: newStatus });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (!user || (user.role !== 'employer' && user.role !== 'recruiter')) {
    return <div className="page-container empty-state"><h2>Access Restricted</h2><p>Recruiter access required.</p></div>;
  }
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  const filtered = filter === 'All'
    ? applications
    : applications.filter(a => a.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Recruiter Applications Pipeline
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
          {applications.length} candidate applications submitted across your posted jobs
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '50px',
              background: filter === s ? 'var(--primary-light)' : 'var(--glass)',
              border: `1px solid ${filter === s ? 'rgba(99, 102, 241, 0.3)' : 'var(--glass-border)'}`,
              color: filter === s ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.85rem', fontWeight: '600', textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {s} {s !== 'All' && `(${applications.filter(a => a.status?.toLowerCase() === s.toLowerCase()).length})`}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Candidate</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Job Position</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Applied Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Application Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'white' }}>
                          {app.candidateName?.charAt(0)?.toUpperCase() || app.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{app.candidateName || app.name || 'Candidate'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.candidateEmail || app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '500', color: 'var(--text-main)' }}>{app.jobTitle}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{app.date || app.createdAt ? new Date(app.date || app.createdAt).toLocaleDateString() : 'Recently'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.65rem', borderRadius: '6px',
                          background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                          color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600',
                          cursor: 'pointer', textTransform: 'capitalize'
                        }}
                      >
                        {['applied', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Link to={`/recruiter/candidates?id=${app.candidateId || app.userId}`} className="btn btn-secondary btn-sm">
                        <User size={14} /> Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
          <FileText size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>No candidate applications found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Applications submitted for your job postings will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
