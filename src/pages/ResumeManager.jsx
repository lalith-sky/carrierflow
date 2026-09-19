import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, Trash2, Download, CheckCircle, AlertCircle, Sparkles, Award } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { resumeAPI } from '../services/api';
import { Card, Button, Badge, Alert } from '../components/ui/UIComponents';

const ResumeManager = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchResumes = useCallback(async () => {
    try {
      const data = await resumeAPI.getAll();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchResumes();
  }, [user, fetchResumes]);

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem' }}>
          <h2>Please sign in</h2>
          <p style={{ color: 'var(--text-muted)' }}>Log in to access your Resume Center.</p>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</Link>
        </Card>
      </div>
    );
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setMessage({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be under 5MB.' });
      return;
    }

    setUploading(true);
    try {
      await resumeAPI.upload(file);
      await fetchResumes();
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await resumeAPI.delete(id);
      setResumes(r => r.filter(res => res.id !== id));
      setMessage({ type: 'success', text: 'Resume deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete resume.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Resume <span style={{ color: 'var(--primary)' }}>Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            Upload, analyze, and manage your resumes for ATS compliance.
          </p>
        </div>

        <Button onClick={() => navigate('/ai/resume-analyzer')} variant="secondary">
          <Sparkles size={16} /> Run ATS Scanner
        </Button>
      </div>

      {message.text && (
        <Alert type={message.type === 'error' ? 'danger' : 'success'}>
          {message.text}
        </Alert>
      )}

      {/* Health Score Overview */}
      <Card style={{ marginBottom: '2.5rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Award size={20} color="var(--success)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Resume Health & ATS Score</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Strong formatting, quantified metrics, and keywords detected.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', lineHeight: 1 }}>88 / 100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase' }}>ATS Score</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Box */}
      <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', marginBottom: '2.5rem', border: '2px dashed var(--glass-border)', background: 'var(--glass)' }}>
        <Upload size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Upload a new resume</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Supports PDF, DOC, DOCX up to 5MB.</p>
        <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
          {uploading ? 'Uploading File...' : 'Choose Resume File'}
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </Card>

      {/* Uploaded Resumes */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Uploaded Documents</h3>
      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading documents...</div>
      ) : resumes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No resumes uploaded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resumes.map(res => (
            <Card key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FileText size={24} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{res.filename || 'Resume Document'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(res.uploadedAt || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="danger" size="sm" onClick={() => handleDelete(res.id)}>
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

export default ResumeManager;
