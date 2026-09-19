import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, Menu, X, LayoutDashboard, Heart, FileText, Bell, Building2, Users, Calendar, Search, ChevronDown, Bot, Sun, Moon, Compass, MessageSquare, Scale } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import GlobalSearchModal from './GlobalSearchModal';

const Navbar = () => {
  const { user, logout, unreadCount } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setIsMenuOpen(false); setShowProfileMenu(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--text-main)' : 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.925rem',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  });

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'var(--bg-dark)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '0.75rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Briefcase size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>CareerFlow</span>
          </Link>

          {/* Quick Search Bar trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open global search"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              color: 'var(--text-muted)', padding: '0.45rem 0.9rem', borderRadius: '50px',
              fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <Search size={15} color="var(--primary)" />
            <span>Search jobs, skills...</span>
            <span style={{ background: 'var(--glass-border)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', opacity: 0.8 }}>Ctrl+K</span>
          </button>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {!user ? (
              <>
                <Link to="/jobs" style={navLinkStyle('/jobs')}>Find Jobs</Link>
                <Link to="/companies" style={navLinkStyle('/companies')}>Companies</Link>
                <Link to="/career-roadmap" style={navLinkStyle('/career-roadmap')}><Compass size={15} /> Roadmap</Link>
                <Link to="/ai/career-assistant" style={navLinkStyle('/ai/career-assistant')}><Bot size={15} /> AI</Link>
                
                <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)' }} />
                <Link to="/auth" style={{ ...navLinkStyle('/auth'), color: 'var(--text-muted)' }}>Sign In</Link>
                <Link to="/auth?mode=register" className="btn btn-primary btn-sm">Join Now</Link>
              </>
            ) : user.role === 'candidate' ? (
              <>
                <Link to="/jobs" style={navLinkStyle('/jobs')}><Search size={15} /> Jobs</Link>
                <Link to="/saved-jobs" style={navLinkStyle('/saved-jobs')}><Heart size={15} /> Saved</Link>
                <Link to="/compare-jobs" style={navLinkStyle('/compare-jobs')}><Scale size={15} /> Compare</Link>
                <Link to="/applications" style={navLinkStyle('/applications')}><FileText size={15} /> Apps</Link>
                <Link to="/messages" style={navLinkStyle('/messages')}><MessageSquare size={15} /> Messages</Link>
                <Link to="/ai/career-assistant" style={navLinkStyle('/ai/career-assistant')}><Bot size={15} /> AI</Link>

                <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <Link to="/notifications" className="notification-badge" style={{ color: 'var(--text-muted)', position: 'relative' }}>
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>

                <div ref={profileRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: '700', color: 'white'
                    }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  {showProfileMenu && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                      background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-lg)', padding: '0.5rem', minWidth: '200px',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>
                      <Link to="/candidate" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <User size={16} /> Portfolio Profile
                      </Link>
                      <Link to="/career-roadmap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Compass size={16} /> Career Roadmap
                      </Link>
                      <Link to="/resume" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <FileText size={16} /> Resume Center
                      </Link>
                      <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/employer" style={navLinkStyle('/employer')}><LayoutDashboard size={15} /> Dashboard</Link>
                <Link to="/recruiter/jobs" style={navLinkStyle('/recruiter/jobs')}><Briefcase size={15} /> Jobs</Link>
                <Link to="/recruiter/candidates" style={navLinkStyle('/recruiter/candidates')}><Users size={15} /> Candidates</Link>
                <Link to="/recruiter/applications" style={navLinkStyle('/recruiter/applications')}><FileText size={15} /> Applications</Link>
                <Link to="/messages" style={navLinkStyle('/messages')}><MessageSquare size={15} /> Messages</Link>

                <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <Link to="/notifications" className="notification-badge" style={{ color: 'var(--text-muted)', position: 'relative' }}>
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>

                <div ref={profileRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: '700', color: 'white'
                    }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  {showProfileMenu && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                      background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-lg)', padding: '0.5rem', minWidth: '200px',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.company || 'Employer'}</p>
                      </div>
                      <Link to="/post-job" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Briefcase size={16} /> Post a Job
                      </Link>
                      <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation menu" style={{
            display: 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.25rem'
          }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--bg-dark)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem'
          }}>
            {!user ? (
              <>
                <Link to="/jobs" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Find Jobs</Link>
                <Link to="/companies" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Companies</Link>
                <Link to="/career-roadmap" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Career Roadmap</Link>
                <Link to="/ai/career-assistant" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>AI Assistant</Link>
                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                <Link to="/auth" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Sign In</Link>
                <Link to="/auth?mode=register" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>Join Now</Link>
              </>
            ) : user.role === 'candidate' ? (
              <>
                <Link to="/candidate" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LayoutDashboard size={16} /> Dashboard</Link>
                <Link to="/jobs" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={16} /> Find Jobs</Link>
                <Link to="/saved-jobs" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={16} /> Saved Jobs</Link>
                <Link to="/compare-jobs" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Scale size={16} /> Compare Jobs</Link>
                <Link to="/applications" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Applications</Link>
                <Link to="/messages" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={16} /> Messages</Link>
                <Link to="/career-roadmap" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Compass size={16} /> Career Roadmap</Link>
                <Link to="/notifications" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={16} /> Notifications {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}</Link>
                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                <button onClick={handleLogout} style={{ padding: '0.75rem', color: 'var(--danger)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}><LogOut size={16} /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/employer" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LayoutDashboard size={16} /> Dashboard</Link>
                <Link to="/recruiter/jobs" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> My Jobs</Link>
                <Link to="/post-job" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> Post a Job</Link>
                <Link to="/recruiter/candidates" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} /> Candidates</Link>
                <Link to="/recruiter/applications" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} /> Applications</Link>
                <Link to="/messages" style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={16} /> Messages</Link>
                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                <button onClick={handleLogout} style={{ padding: '0.75rem', color: 'var(--danger)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}><LogOut size={16} /> Logout</button>
              </>
            )}
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>
      </nav>

      {/* Global Search Overlay */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
