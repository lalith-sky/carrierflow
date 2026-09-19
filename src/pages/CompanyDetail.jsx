import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companiesAPI, jobsAPI } from '../services/api';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      const [companyData, jobsData] = await Promise.all([
        companiesAPI.getById(id),
        jobsAPI.getAll({ companyId: id })
      ]);
      setCompany(companyData);
      setJobs(jobsData.jobs || []);
    } catch (err) {
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#94a3b8' }}>Loading company details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '60px 20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Company not found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>This company does not exist or has been removed</p>
          <button className="btn-secondary" onClick={() => navigate('/companies')}>
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        onClick={() => navigate('/companies')}
        style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Companies
      </button>

      <div className="glass-card" style={{ padding: '40px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fff',
            flexShrink: 0
          }}>
            {company.name?.charAt(0) || 'C'}
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '12px', color: '#fff' }}>
              {company.name}
            </h1>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              {company.industry && (
                <span className="badge" style={{ fontSize: '0.95rem' }}>
                  {company.industry}
                </span>
              )}
              {company.size && (
                <span className="badge" style={{ fontSize: '0.95rem' }}>
                  {company.size}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: '#94a3b8', fontSize: '0.95rem' }}>
              {company.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location}
                </div>
              )}
              {company.website && (
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', textDecoration: 'none' }}
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit Website
                </a>
              )}
              {company.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {company.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {company.description && (
          <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#fff' }}>About</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>
              {company.description}
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#fff' }}>
          Open Positions ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 20px', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No open positions</h3>
            <p style={{ color: '#94a3b8' }}>This company is not currently hiring</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map(job => (
              <div 
                key={job.id}
                className="glass-card hover-lift"
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{ 
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#fff' }}>
                      {job.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <span className="badge">
                        {job.type}
                      </span>
                      <span className="badge">
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="badge" style={{ color: '#10b981' }}>
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <p style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.95rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {job.description}
                    </p>
                  </div>

                  <button 
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
