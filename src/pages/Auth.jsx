import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Building2, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/JobContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, login: loginUser, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'employer' ? '/employer' : '/candidate');
  }, [user]);

  const validate = () => {
    if (!formData.email || !formData.password) return 'Email and password are required.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin && !formData.name) return 'Full name is required.';
    if (!isLogin && role === 'employer' && !formData.company) return 'Company name is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await loginUser({ email: formData.email, password: formData.password });
      } else {
        await register({ name: formData.name, email: formData.email, password: formData.password, role, company: formData.company });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', background: 'var(--bg-darker)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none', fontSize: '0.95rem' };

  return (
    <div className="page-container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card-static" style={{ maxWidth: '480px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{isLogin ? 'Sign in to manage your career' : 'Join CareerFlow today'}</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Role Selection */}
        {!isLogin && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
            {[{ r: 'candidate', label: 'Candidate', Icon: User }, { r: 'employer', label: 'Recruiter', Icon: Building2 }].map(({ r, label, Icon }) => (
              <button key={r} type="button" onClick={() => setRole(r)} style={{
                padding: '1rem', borderRadius: 'var(--radius-lg)',
                border: `2px solid ${role === r ? 'var(--primary)' : 'var(--glass-border)'}`,
                background: role === r ? 'var(--primary-light)' : 'transparent',
                color: role === r ? 'white' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
              }}>
                <Icon size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{label}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          {!isLogin && (
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input required type="text" placeholder="John Doe" value={formData.name} style={inputStyle} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
            </div>
          )}

          {!isLogin && role === 'employer' && (
            <div>
              <label className="form-label">Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input required type="text" placeholder="Acme Inc." value={formData.company} style={inputStyle} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required type="email" placeholder="name@company.com" value={formData.email} style={inputStyle} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input required type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} style={{ ...inputStyle, paddingRight: '2.5rem' }} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && <p className="form-hint">Must be at least 6 characters</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem', fontSize: '1rem' }}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '0.5rem', cursor: 'pointer' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
