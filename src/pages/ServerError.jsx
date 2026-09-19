import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';

const ServerError = () => {
  return (
    <div style={{
      minHeight: '75vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        fontSize: '6rem', fontWeight: '900', color: 'var(--danger)',
        lineHeight: 1, marginBottom: '1rem'
      }}>
        500
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        Server Error
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', marginBottom: '2rem' }}>
        Something went wrong on our end. Please try refreshing the page or try again in a few moments.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          <RefreshCw size={16} /> Try Again
        </button>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
