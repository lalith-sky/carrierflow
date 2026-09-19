import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, Globe, Save, Plus, X, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { profileAPI } from '../services/api';
import { Card, Button, Badge, Alert, Input } from '../components/ui/UIComponents';

const CandidateProfile = () => {
  const { user } = useApp();
  const [profile, setProfile] = useState({
    headline: '', about: '', phone: '', location: '',
    skills: [], education: [], experience: [], projects: [], certifications: [],
    github: '', linkedin: '', portfolio: '', preferredJobType: '', preferredLocation: '', workMode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const d = await profileAPI.get();
      if (d.profile) setProfile(prev => ({ ...prev, ...d.profile }));
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, fetchProfile]);

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <Card style={{ padding: '3rem' }}>
          <h2>Please Sign In</h2>
          <p style={{ color: 'var(--text-muted)' }}>You must be logged in as a candidate to view your profile portfolio.</p>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</Link>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileAPI.update(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (s) => setProfile(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }));

  const completion = (() => {
    let s = 20;
    if (profile.headline) s += 15;
    if (profile.about) s += 15;
    if (profile.skills?.length) s += 20;
    if (profile.experience?.length) s += 15;
    if (profile.phone) s += 5;
    if (profile.location) s += 10;
    return Math.min(s, 100);
  })();

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Candidate <span style={{ color: 'var(--primary)' }}>Portfolio Profile</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            Manage your public candidate profile, skills, and background information.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && <Badge variant="success">✓ Saved</Badge>}
          <Button onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      {/* Completion Meter */}
      <Card style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '700' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Profile Completeness</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{completion}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
        </div>
      </Card>

      {/* Grid: Main Info + Social Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* General Bio */}
          <Card>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Basic Information</h3>
            <Input
              label="Professional Headline"
              value={profile.headline}
              onChange={(e) => setProfile(p => ({ ...p, headline: e.target.value }))}
              placeholder="e.g. Senior Frontend Developer | React, TypeScript"
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.4rem' }}>About / Bio</label>
              <textarea
                rows={4}
                value={profile.about}
                onChange={(e) => setProfile(p => ({ ...p, about: e.target.value }))}
                placeholder="Passionate engineer with 4+ years of experience building modern web applications..."
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)', background: 'var(--glass)',
                  color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                placeholder="New York, NY or Remote"
              />
            </div>
          </Card>

          {/* Skills Management */}
          <Card>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Technical Skills & Tools</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <Input
                placeholder="Add a skill (e.g. React, Docker, Python)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                style={{ marginBottom: 0 }}
              />
              <Button onClick={addSkill} variant="secondary">Add</Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.skills || []).map((skill, idx) => (
                <span key={idx} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600'
                }}>
                  {skill}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Social Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Online Profiles</h3>
            <Input
              label="GitHub Profile URL"
              icon={Code}
              value={profile.github}
              onChange={(e) => setProfile(p => ({ ...p, github: e.target.value }))}
              placeholder="https://github.com/username"
            />
            <Input
              label="LinkedIn Profile URL"
              icon={Globe}
              value={profile.linkedin}
              onChange={(e) => setProfile(p => ({ ...p, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
            />
            <Input
              label="Portfolio / Personal Site"
              icon={Globe}
              value={profile.portfolio}
              onChange={(e) => setProfile(p => ({ ...p, portfolio: e.target.value }))}
              placeholder="https://yourportfolio.dev"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
