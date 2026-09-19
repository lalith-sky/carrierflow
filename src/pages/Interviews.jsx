import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, ExternalLink, User } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { interviewsAPI } from '../services/api';
import { Card, Badge, Button, EmptyState } from '../components/ui/UIComponents';

const Interviews = () => {
  const { user } = useApp();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = useCallback(async () => {
    try {
      const data = await interviewsAPI.getAll();
      setInterviews(Array.isArray(data) ? data : data.interviews || []);
    } catch (err) {
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchInterviews();
  }, [user, fetchInterviews]);

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  const upcoming = interviews.filter(i => new Date(i.date) >= new Date());
  const past = interviews.filter(i => new Date(i.date) < new Date());

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Interview <span style={{ color: 'var(--primary)' }}>Center</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
          {upcoming.length} upcoming interview session{upcoming.length === 1 ? '' : 's'}, {past.length} past
        </p>
      </div>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Upcoming Meetings</h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {upcoming.map(interview => (
              <Card key={interview.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{interview.jobTitle}</h3>
                    <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem', marginTop: '0.2rem' }}>{interview.company || 'Tech Employer'}</div>
                  </div>
                  <Badge variant="warning">Scheduled</Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', background: 'var(--glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <Calendar size={16} color="var(--primary)" />
                    <span>{new Date(interview.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>{interview.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <Video size={16} color="var(--primary)" />
                    <span>{interview.type || 'Video Call'}</span>
                  </div>
                </div>

                {interview.link && (
                  <a href={interview.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <ExternalLink size={14} /> Join Video Meeting
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {interviews.length === 0 && (
        <EmptyState
          title="No interview sessions scheduled"
          description="When recruiters shortlist your applications for an interview, meeting details will appear here."
          actionLabel="View Applications"
          onAction={() => window.location.href = '/applications'}
        />
      )}
    </div>
  );
};

export default Interviews;
