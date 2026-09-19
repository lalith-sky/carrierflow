import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Globe, Share2, Code, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--glass-border)', padding: '4rem 0 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={18} color="white" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>CareerFlow</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              The next generation job platform connecting ambitious professionals with industry-leading companies.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, Share2, Code, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: '600' }}>Find Jobs</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              {['Browse Jobs', 'Companies', 'Internships', 'Remote Jobs', 'Career Resources'].map((item, i) => (
                <li key={i}><Link to="/jobs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}>{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: '600' }}>For Candidates</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              {['Create Profile', 'Upload Resume', 'Job Alerts', 'Saved Jobs', 'AI Career Assistant'].map((item, i) => (
                <li key={i}><Link to="/auth" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}>{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: '600' }}>For Employers</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              {['Post a Job', 'Find Candidates', 'Pricing', 'Hiring Solutions', 'Employer Help'].map((item, i) => (
                <li key={i}><Link to="/auth" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}>{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: '600' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              {['About', 'Contact', 'Privacy Policy', 'Terms of Service', 'Blog'].map((item, i) => (
                <li key={i}><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}>{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} CareerFlow. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map((item, i) => (
              <a key={i} href="#" style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
