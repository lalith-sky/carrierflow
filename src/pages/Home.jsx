import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Users, ShieldCheck, Code, Brain, Database, BarChart3, Shield, Cloud, Palette, Smartphone, Box, Megaphone, ChevronRight, Star, Building2, ArrowRight, UserPlus, Send, CheckCircle, Heart, Zap, Sparkles, Bot, Compass, Award } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { statsAPI } from '../services/api';
import { Badge, Card, Button } from '../components/ui/UIComponents';

const CATEGORIES = [
  { name: 'Software Development', icon: Code, count: 14 },
  { name: 'AI / Machine Learning', icon: Brain, count: 8 },
  { name: 'Data Science', icon: Database, count: 10 },
  { name: 'Data Analytics', icon: BarChart3, count: 6 },
  { name: 'Cybersecurity', icon: Shield, count: 5 },
  { name: 'Cloud / DevOps', icon: Cloud, count: 12 },
  { name: 'UI/UX', icon: Palette, count: 7 },
  { name: 'Mobile Development', icon: Smartphone, count: 9 },
  { name: 'Product Management', icon: Box, count: 4 },
  { name: 'Marketing', icon: Megaphone, count: 3 },
];

const POPULAR_SEARCHES = ['React', 'Python', 'Data Science', 'AI/ML', 'Java', 'Cloud', 'Cybersecurity'];

const TRUSTED_COMPANIES = [
  { name: 'TechNova', industry: 'Technology' },
  { name: 'CreativeCloud', industry: 'Design' },
  { name: 'DataFlow Systems', industry: 'Analytics' },
  { name: 'CloudScale', industry: 'Cloud Infrastructure' },
  { name: 'AI Insights', industry: 'Artificial Intelligence' },
  { name: 'AppCraft', industry: 'Mobile Apps' }
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Frontend Developer at TechNova', text: 'CareerFlow made my job search remarkably efficient. The AI matching algorithm highlighted exactly where my skills fit best.', rating: 5 },
  { name: 'Alex Chen', role: 'Engineering Manager at CloudScale', text: 'As a recruiter, CareerFlow has transformed our technical hiring process. The qualified candidate pipeline has halved our time-to-hire.', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Scientist at AI Insights', text: 'The career roadmap and resume analyzer helped me prepare for target interviews. Applied to hired in under 3 weeks.', rating: 5 },
];

const Home = () => {
  const { jobs = [] } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [stats, setStats] = useState({ totalJobs: jobs.length || 12, totalCandidates: 1450, totalCompanies: 85, totalApplications: 3200 });

  const featuredJobs = jobs.slice(0, 6);

  useEffect(() => {
    statsAPI.getPublic().then(data => {
      if (data) setStats(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (locationTerm) params.set('location', locationTerm);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative', padding: '5rem 1.5rem 4rem', textAlign: 'center',
        maxWidth: '1200px', margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--primary-light)', color: 'var(--primary)',
          padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem',
          fontWeight: '600', marginBottom: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.25)'
        }}>
          <Sparkles size={16} /> The Next-Generation Career & Recruitment Engine
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900',
          lineHeight: '1.15', color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '-0.025em'
        }}>
          Find Work That Moves <br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your Career Forward.
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '680px',
          margin: '0 auto 2.5rem', lineHeight: '1.7'
        }}>
          CareerFlow connects ambitious software engineers, designers, data scientists, and leaders with high-growth tech companies worldwide.
        </p>

        {/* Large Search Interface */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '850px', margin: '0 auto 1.5rem', background: 'var(--bg-dark)',
          border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)',
          padding: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job title, skills, or company..."
              style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.975rem', outline: 'none' }}
            />
          </div>

          <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)', alignSelf: 'center' }} className="search-divider" />

          <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
            <MapPin size={20} color="var(--primary)" />
            <input
              type="text"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              placeholder="Location or 'Remote'"
              style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.975rem', outline: 'none' }}
            />
          </div>

          <Button type="submit" size="lg" style={{ minWidth: '140px' }}>
            Search Jobs
          </Button>
        </form>

        {/* Popular Searches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Popular:</span>
          {POPULAR_SEARCHES.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTagClick(tag)}
              style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                color: 'var(--text-main)', padding: '0.2rem 0.65rem', borderRadius: '6px',
                fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Trusted Companies Logo Wall */}
      <section style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '2rem 1.5rem', background: 'var(--bg-dark)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px', fontWeight: '700', marginBottom: '1.25rem' }}>
            Trusted by Hiring Managers at Top Companies
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
            {TRUSTED_COMPANIES.map((comp, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 0.2s' }}>
                <Building2 size={20} color="var(--primary)" />
                <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Explore Popular Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Discover open roles across leading technology domains.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count || 8}+ open jobs</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Opportunities */}
      <section style={{ background: 'var(--bg-dark)', padding: '4.5rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Featured Opportunities</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Verified positions with top-tier compensation & benefits.</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {featuredJobs.map((job) => (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: '700' }}>{job.title}</h3>
                    <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.25rem' }}>{job.company}</div>
                  </div>
                  <Badge variant="primary">{job.type}</Badge>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={14} /> {job.workMode || 'Remote'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight: '700', color: 'var(--success)', fontSize: '0.95rem' }}>{job.salary}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>View Details →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Career Suite Feature Highlight */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(168, 85, 247, 0.12)', color: 'var(--secondary)',
            padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem',
            fontWeight: '600', marginBottom: '1rem'
          }}>
            <Bot size={16} /> Intelligent Career Assistant
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Accelerate Hiring with Built-In AI Tools
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            From real-time job match calculations to ATS resume optimization and interactive interview prep.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card onClick={() => navigate('/ai/resume-analyzer')}>
            <Sparkles size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>AI Resume ATS Scanner</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Evaluate your resume text against real recruiter ATS algorithms, identifying missing keywords and formatting improvements.
            </p>
          </Card>

          <Card onClick={() => navigate('/ai/career-assistant')}>
            <Bot size={24} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>AI Career Assistant</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your 24/7 personal career copilot providing tailored interview strategy, skill gap advice, and job recommendations.
            </p>
          </Card>

          <Card onClick={() => navigate('/career-roadmap')}>
            <Compass size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Interactive Career Roadmap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Track skill milestones from Beginner to Advanced, unlocking target roles at top tech companies.
            </p>
          </Card>
        </div>
      </section>

      {/* Platform Statistics */}
      <section style={{ background: 'var(--bg-dark)', padding: '4rem 1.5rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>{stats.totalJobs}+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.25rem' }}>Active Tech Jobs</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)' }}>{stats.totalCandidates}+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.25rem' }}>Qualified Candidates</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--success)' }}>{stats.totalCompanies}+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.25rem' }}>Hiring Companies</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)' }}>98.4%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.25rem' }}>Application Match Rate</div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '3.5rem 2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(99, 102, 241, 0.3)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Ready to Take the Next Step in Your Career?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 2rem' }}>
          Create your profile today to access verified job opportunities, AI match analysis, and direct messaging with recruiters.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/auth?mode=register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/jobs" className="btn btn-secondary btn-lg">Explore Jobs</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
