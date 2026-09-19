import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Eye, Trash2, Edit2 } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { recruiterAPI, jobsAPI } from '../services/api';

const RecruiterJobs = () => {
  const { user } = useApp();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'employer') fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const data = await recruiterAPI.getJobs();
      setJobs(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await jobsAPI.delete(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch {}
  };

  if (user?.role !== 'employer') return <div className="page-container empty-state"><h2>Access Denied</h2></div>;
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Job Listings</h1>
          <p>{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted</p>
        </div>
        <Link to="/post-job" className="btn btn-primary"><Plus size={18} /> Post New Job</Link>
      </div>

      {jobs.length > 0 ? (
        <div className="glass-card-static" style={{ padding: '1.75rem' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <p style={{ fontWeight: '600', marginBottom: '0.15rem' }}>{job.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.location}</p>
                    </td>
                    <td><span className="badge badge-neutral">{job.category}</span></td>
                    <td><span className="badge badge-primary">{job.type}</span></td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <span className={`status-dot ${job.status === 'active' ? 'status-active' : 'status-closed'}`} />
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.posted}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/jobs/${job.id}`} className="btn-icon" title="View"><Eye size={16} /></Link>
                        <button onClick={() => handleDelete(job.id)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <Briefcase size={48} />
          <h3>No jobs posted yet</h3>
          <p>Start by posting your first job listing</p>
          <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
