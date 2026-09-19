import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { recruiterAPI, interviewsAPI } from '../services/api';

const RecruiterCandidates = () => {
  const { user } = useApp();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewData, setInterviewData] = useState({ date: '', time: '', type: 'Video', meetingLink: '' });

  useEffect(() => {
    let active = true;
    if (user?.role === 'employer') {
      recruiterAPI.getCandidates().then(data => {
        if (active) {
          setCandidates(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      }).catch(err => {
        console.error('Failed to fetch candidates:', err);
        if (active) setLoading(false);
      });
    }
    return () => { active = false; };
  }, [user]);

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await interviewsAPI.create({
        ...interviewData,
        candidateId: selectedCandidate.userId,
        jobId: selectedCandidate.jobId,
        jobTitle: selectedCandidate.jobTitle
      });
      setShowScheduleModal(false);
      alert('Interview scheduled successfully!');
    } catch {}
  };

  if (user?.role !== 'employer') return <div className="page-container empty-state"><h2>Access Denied</h2></div>;
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Candidates</h1>
        <p>{candidates.length} total candidates</p>
      </div>

      {candidates.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {candidates.map(candidate => (
            <div key={candidate.id} className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1.25rem', flex: 1 }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
                    {candidate.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.25rem' }}>{candidate.name}</h3>
                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{candidate.profile?.headline || 'No headline'}</p>
                    <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {candidate.email}</div>
                      {candidate.profile?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={14} /> {candidate.profile.phone}</div>}
                      {candidate.profile?.location && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {candidate.profile.location}</div>}
                    </div>
                    {candidate.profile?.skills && candidate.profile.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                        {candidate.profile.skills.slice(0, 5).map((s, i) => <span key={i} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{s}</span>)}
                        {candidate.profile.skills.length > 5 && <span className="badge badge-neutral">+{candidate.profile.skills.length - 5}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Applied for</p>
                    <p style={{ fontWeight: '600' }}>{candidate.jobTitle}</p>
                    <span className={`badge badge-${candidate.status === 'Shortlisted' ? 'primary' : 'neutral'}`} style={{ marginTop: '0.5rem' }}>{candidate.status}</span>
                  </div>
                  <button onClick={() => { setSelectedCandidate(candidate); setShowScheduleModal(true); }} className="btn btn-primary btn-sm">
                    <Calendar size={14} /> Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <User size={48} />
          <h3>No candidates yet</h3>
          <p>Candidates who apply to your jobs will appear here</p>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={() => setShowScheduleModal(false)} className="modal-close">✕</button>
            <h2 style={{ marginBottom: '1.5rem' }}>Schedule Interview</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>for {selectedCandidate?.name}</p>
            <form onSubmit={handleScheduleInterview} style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="form-row">
                <div>
                  <label className="form-label">Date</label>
                  <input required type="date" value={interviewData.date} onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <input required type="time" value={interviewData.time} onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Interview Type</label>
                <select value={interviewData.type} onChange={(e) => setInterviewData({ ...interviewData, type: e.target.value })} className="form-select">
                  <option>Video</option>
                  <option>Phone</option>
                  <option>On-site</option>
                </select>
              </div>
              <div>
                <label className="form-label">Meeting Link</label>
                <input type="url" value={interviewData.meetingLink} onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })} className="form-input" placeholder="https://meet.google.com/..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Schedule Interview</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterCandidates;
