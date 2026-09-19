import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Forbidden = () => {
  return (
    <div style={{
      minHeight: '75vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.12)', border: '2px solid rgba(239, 68, 68, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)',
        marginBottom: '1.5rem'
      }}>
        <ShieldAlert size={40} />
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        403 — Access Restricted
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', marginBottom: '2rem' }}>
        You don't have authorization to view this recruiter or candidate restricted area.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
};

export default Forbidden;
