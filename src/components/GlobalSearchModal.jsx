import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building2, User, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/JobContext';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { jobs = [], user } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredJobs = query.trim()
    ? jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const handleSelectJob = (id) => {
    onClose();
    navigate(`/jobs/${id}`);
  };

  const handleFullSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      navigate(`/jobs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '640px',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        {/* Search Input Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)' }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleFullSearch}
            placeholder="Search jobs, skills, companies... (Press Enter to view all results)"
            style={{
              flex: 1, background: 'none', border: 'none', color: 'var(--text-main)',
              fontSize: '1.05rem', outline: 'none'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results / Suggestions Area */}
        <div style={{ padding: '1rem 1.25rem', maxHeight: '380px', overflowY: 'auto' }}>
          {query.trim() === '' ? (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.75rem' }}>Popular Searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['React Developer', 'Full Stack', 'Data Science', 'UI/UX Designer', 'Product Manager', 'Remote'].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose();
                      navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                    }}
                    style={{
                      background: 'var(--glass)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)', padding: '0.35rem 0.75rem', borderRadius: '6px',
                      fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.75rem' }}>Matching Jobs</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(job.id)}
                    style={{
                      padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      background: 'var(--glass)', border: '1px solid var(--glass-border)',
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{job.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{job.company} • {job.location}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500' }}>View Job →</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No immediate matches for "{query}". Press Enter to run full job search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
