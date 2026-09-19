import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, Upload, CheckCircle, Heart, Clock, Building2, Users, Globe, AlertCircle, ExternalLink, Share2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { jobsAPI } from '../services/api';
import AIMatchScore from '../components/AIMatchScore';
import { Card, Badge, Button, Modal, Alert } from '../components/ui/UIComponents';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, applyToJob, hasApplied, saveJob, unsaveJob, isJobSaved } = useApp();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({ coverLetter: '' });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobsAPI.getById(id);
        setJob(data.job);
        setRelatedJobs(data.relatedJobs || []);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setApplying(true);
    setApplyError('');
    try {
      await applyToJob({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        coverLetter: applicationData.coverLetter
      });
      setApplySuccess(true);
      setTimeout(() => { setShowApplyModal(false); setApplySuccess(false); }, 2500);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { navigate('/auth'); return; }
    try {
      if (isJobSaved(job.id)) await unsaveJob(job.id);
      else await saveJob(job.id);
    } catch {}
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!job) return <div className="page-container empty-state"><h3>Job not found</h3><p>This job may have been removed.</p><Link to="/jobs" className="btn btn-primary">Browse Jobs</Link></div>;

  const alreadyApplied = hasApplied(job.id);
  const isSaved = isJobSaved(job.id);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
        <ChevronLeft size={18} /> Back to Jobs
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          <Card style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white', fontWeight: '800', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {job.company?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem', color: 'var(--text-main)', fontWeight: '800' }}>{job.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.75rem' }}>
                  {job.company} <CheckCircle2 size={16} color="var(--success)" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <Badge variant="neutral"><MapPin size={12} /> {job.location}</Badge>
                  {job.workMode && <Badge variant="primary">{job.workMode}</Badge>}
                  <Badge variant="neutral">{job.type}</Badge>
                  {job.experience && <Badge variant="neutral">{job.experience}</Badge>}
                </div>
              </div>
            </div>

            {/* AI Match Score Component */}
            <AIMatchScore job={job} />

            {/* Quick Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
              {[
                { icon: <DollarSign size={18} color="var(--success)" />, label: 'Salary', value: job.salary },
                { icon: <Clock size={18} color="var(--primary)" />, label: 'Posted', value: job.posted },
                { icon: <Calendar size={18} color="var(--warning)" />, label: 'Deadline', value: job.applicationDeadline || 'Open' },
                { icon: <Briefcase size={18} color="var(--secondary)" />, label: 'Type', value: job.type },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>{item.label}</p>
                    <p style={{ fontWeight: '600', fontSize: '0.925rem', margin: 0, color: 'var(--text-main)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Required Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.skills.map((s, i) => <Badge key={i} variant="primary">{s}</Badge>)}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>About the Role</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Key Responsibilities</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Requirements & Qualifications</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </Card>
        </div>

        {/* Sticky Right Application Panel */}
        <aside style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <Card style={{ padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compensation</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.25rem' }}>{job.salary}</div>
            </div>

            {alreadyApplied ? (
              <Alert type="success">
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>✓ Application Submitted</div>
                <div style={{ fontSize: '0.85rem' }}>Current Status: <strong style={{ textTransform: 'capitalize' }}>Under Review</strong></div>
              </Alert>
            ) : (
              <Button
                variant="primary"
                onClick={() => setShowApplyModal(true)}
                style={{ width: '100%', marginBottom: '1rem', justifyContent: 'center' }}
              >
                Apply Now
              </Button>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="outline"
                onClick={handleSave}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} color={isSaved ? 'var(--danger)' : 'currentColor'} />
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply for ${job.title}`}>
        {applySuccess ? (
          <Alert type="success">
            Application submitted successfully! Redirecting...
          </Alert>
        ) : (
          <form onSubmit={handleApply}>
            {applyError && <Alert type="danger">{applyError}</Alert>}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Cover Letter / Note to Recruiter
              </label>
              <textarea
                rows={5}
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({ coverLetter: e.target.value })}
                placeholder="Briefly explain why you're a great fit for this position..."
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)', background: 'var(--glass)',
                  color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none'
                }}
              />
            </div>

            <Button type="submit" disabled={applying} style={{ width: '100%', justifyContent: 'center' }}>
              {applying ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default JobDetail;
