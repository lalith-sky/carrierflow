import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { jobsAPI } from '../services/api';

const PostJob = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '', category: 'Software Development', location: '', salary: '',
    type: 'Full-time', workMode: 'Remote', experience: '3-5 years',
    description: '', responsibilities: [], requirements: [],
    preferredQualifications: [], skills: [], benefits: [],
    applicationDeadline: ''
  });
  const [tempInput, setTempInput] = useState({ responsibilities: '', requirements: '', preferred: '', skills: '', benefits: '' });

  const addItem = (field, value) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setTempInput({ ...tempInput, [field]: '' });
    }
  };

  const removeItem = (field, idx) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await jobsAPI.create({ ...formData, company: user.company || 'Your Company' });
      navigate('/employer');
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'employer') return <div className="page-container empty-state"><h2>Access Denied</h2><p>Only recruiters can post jobs</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Fill in the details to create a job listing</p>
      </div>

      {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Basic Info */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Basic Information</h3>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Job Title *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="e.g., Senior Frontend Developer" />
              </div>
              <div className="form-row">
                <div>
                  <label className="form-label">Category *</label>
                  <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-select">
                    {['Software Development', 'AI / Machine Learning', 'Data Science', 'Data Analytics', 'Cybersecurity', 'Cloud / DevOps', 'UI/UX', 'Mobile Development', 'Product Management', 'Marketing'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Employment Type *</label>
                  <select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="form-select">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="form-label">Location *</label>
                  <input required type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="form-input" placeholder="e.g., New York, NY" />
                </div>
                <div>
                  <label className="form-label">Work Mode *</label>
                  <select required value={formData.workMode} onChange={(e) => setFormData({ ...formData, workMode: e.target.value })} className="form-select">
                    {['Remote', 'Hybrid', 'On-site'].map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="form-label">Salary Range *</label>
                  <input required type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="form-input" placeholder="e.g., $100k - $140k" />
                </div>
                <div>
                  <label className="form-label">Experience Level *</label>
                  <select required value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="form-select">
                    {['0-1 years', '2-4 years', '3-5 years', '5+ years'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Application Deadline</label>
                <input type="date" value={formData.applicationDeadline} onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })} className="form-input" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Job Description *</h3>
            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-textarea" rows="6" placeholder="Describe the role, what the candidate will do, and what makes this opportunity exciting..." />
          </div>

          {/* Skills */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Required Skills</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="text" value={tempInput.skills} onChange={(e) => setTempInput({ ...tempInput, skills: e.target.value })} placeholder="Type a skill and press Enter" className="form-input"
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('skills', tempInput.skills); } }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.skills.map((s, i) => (
                <span key={i} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {s} <button type="button" onClick={() => removeItem('skills', i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Responsibilities</h3>
            <div style={{ marginBottom: '1rem' }}>
              <textarea value={tempInput.responsibilities} onChange={(e) => setTempInput({ ...tempInput, responsibilities: e.target.value })} placeholder="Enter a responsibility" className="form-textarea" rows="2" />
              <button type="button" onClick={() => addItem('responsibilities', tempInput.responsibilities)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}><Plus size={14} /> Add</button>
            </div>
            <ul style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
              {formData.responsibilities.map((r, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span>{r}</span>
                  <button type="button" onClick={() => removeItem('responsibilities', i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={14} /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Requirements</h3>
            <div style={{ marginBottom: '1rem' }}>
              <textarea value={tempInput.requirements} onChange={(e) => setTempInput({ ...tempInput, requirements: e.target.value })} placeholder="Enter a requirement" className="form-textarea" rows="2" />
              <button type="button" onClick={() => addItem('requirements', tempInput.requirements)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}><Plus size={14} /> Add</button>
            </div>
            <ul style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
              {formData.requirements.map((r, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span>{r}</span>
                  <button type="button" onClick={() => removeItem('requirements', i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={14} /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Preferred */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Preferred Qualifications (Optional)</h3>
            <div style={{ marginBottom: '1rem' }}>
              <textarea value={tempInput.preferred} onChange={(e) => setTempInput({ ...tempInput, preferred: e.target.value })} placeholder="Enter a preferred qualification" className="form-textarea" rows="2" />
              <button type="button" onClick={() => addItem('preferredQualifications', tempInput.preferred)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}><Plus size={14} /> Add</button>
            </div>
            <ul style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
              {formData.preferredQualifications.map((p, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span>{p}</span>
                  <button type="button" onClick={() => removeItem('preferredQualifications', i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={14} /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="glass-card-static" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Benefits</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="text" value={tempInput.benefits} onChange={(e) => setTempInput({ ...tempInput, benefits: e.target.value })} placeholder="Type a benefit and press Enter" className="form-input"
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('benefits', tempInput.benefits); } }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.benefits.map((b, i) => (
                <span key={i} className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {b} <button type="button" onClick={() => removeItem('benefits', i)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/employer')} className="btn btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Publishing...' : 'Publish Job'}</button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
