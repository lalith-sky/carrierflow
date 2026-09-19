import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companiesAPI } from '../services/api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const data = await companiesAPI.getAll();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#94a3b8' }}>Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Explore Companies
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
          Discover top employers hiring on CareerFlow
        </p>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem'
          }}
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <svg style={{ width: '64px', height: '64px', margin: '0 auto 20px', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No companies found</h3>
          <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredCompanies.map(company => (
            <div 
              key={company.id}
              className="glass-card hover-lift"
              onClick={() => navigate(`/companies/${company.id}`)}
              style={{ 
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {company.name?.charAt(0) || 'C'}
              </div>
              
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#fff' }}>
                {company.name}
              </h3>
              
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.95rem', 
                marginBottom: '12px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {company.description || 'No description available'}
              </p>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                {company.industry && (
                  <span className="badge">
                    {company.industry}
                  </span>
                )}
                {company.size && (
                  <span className="badge">
                    {company.size}
                  </span>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location || 'Location N/A'}
                </div>
                
                {company.jobCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontSize: '0.9rem', fontWeight: '500' }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
