import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '75vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        fontSize: '6rem', fontWeight: '900',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1, marginBottom: '1rem'
      }}>
        404
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        Opportunity Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', marginBottom: '2rem' }}>
        Looks like the page or opportunity you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Link to="/jobs" className="btn btn-secondary">
          <Search size={16} /> Browse Open Jobs
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
