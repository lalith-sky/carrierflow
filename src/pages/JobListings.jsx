import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Heart, ChevronDown, X, Clock, CheckCircle2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { jobsAPI } from '../services/api';
import { Card, Badge, Button, Input, Select, Skeleton } from '../components/ui/UIComponents';

const CATEGORIES = ['All', 'Software Development', 'AI / Machine Learning', 'Data Science', 'Data Analytics', 'Cybersecurity', 'Cloud / DevOps', 'UI/UX', 'Mobile Development', 'Product Management', 'Marketing'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['All', '0-1 years', '2-4 years', '3-5 years', '5+ years'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'relevance', label: 'Relevance' }
];

const JobListings = () => {
  const { user, saveJob, unsaveJob, isJobSaved } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || 'All',
    type: searchParams.get('type') || 'All',
    workMode: searchParams.get('workMode') || 'All',
    experience: 'All',
    sort: 'newest',
    page: 1
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.type !== 'All') params.type = filters.type;
      if (filters.workMode !== 'All') params.workMode = filters.workMode;

      const data = await jobsAPI.getAll(params);
      let list = Array.isArray(data) ? data : data.jobs || [];

      if (filters.sort === 'salary-high') {
        list.sort((a, b) => (parseInt(b.salary) || 0) - (parseInt(a.salary) || 0));
      } else if (filters.sort === 'newest') {
        list.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
      }

      setJobs(list);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters.page, filters.sort, filters.category, filters.type, filters.workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: 'All',
      type: 'All',
      workMode: 'All',
      experience: 'All',
      sort: 'newest',
      page: 1
    });
    setSearchParams({});
  };

  const handleSaveToggle = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/auth'); return; }
    try {
      if (isJobSaved(jobId)) await unsaveJob(jobId);
      else await saveJob(jobId);
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const activeFilterChips = [];
  if (filters.search) activeFilterChips.push({ key: 'search', label: `Search: ${filters.search}` });
  if (filters.location) activeFilterChips.push({ key: 'location', label: `Location: ${filters.location}` });
  if (filters.category !== 'All') activeFilterChips.push({ key: 'category', label: filters.category });
  if (filters.type !== 'All') activeFilterChips.push({ key: 'type', label: filters.type });
  if (filters.workMode !== 'All') activeFilterChips.push({ key: 'workMode', label: filters.workMode });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Explore Open <span style={{ color: 'var(--primary)' }}>Opportunities</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Discover verified engineering, design, product, and data positions.
        </p>

        {/* Top Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap',
          background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ flex: '2 1 240px' }}>
            <Input
              icon={Search}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by job title, skill, or keyword..."
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <Input
              icon={MapPin}
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, state, or Remote"
              style={{ marginBottom: 0 }}
            />
          </div>
          <Button type="submit" style={{ minWidth: '120px' }}>
            Search
          </Button>
        </form>
      </div>

      {/* Main Layout: Left Filters + Right Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem' }}>
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar" style={{
          background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '1.5rem', height: 'fit-content'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="var(--primary)" /> Filters
            </h3>
            {activeFilterChips.length > 0 && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter Groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Category
              </label>
              <Select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                options={CATEGORIES}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Employment Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Employment Type
              </label>
              <Select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
                options={JOB_TYPES}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Work Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Work Mode
              </label>
              <Select
                value={filters.workMode}
                onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value, page: 1 }))}
                options={WORK_MODES}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Experience Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Experience Level
              </label>
              <Select
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value, page: 1 }))}
                options={EXPERIENCE_LEVELS}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>
        </aside>

        {/* Right Job Results Feed */}
        <main>
          {/* Active Chips & Controls Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Showing {total} Jobs
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterChips.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {activeFilterChips.map((chip) => (
                <span key={chip.key} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600'
                }}>
                  {chip.label}
                  <X
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (chip.key === 'search') setFilters(prev => ({ ...prev, search: '' }));
                      if (chip.key === 'location') setFilters(prev => ({ ...prev, location: '' }));
                      if (chip.key === 'category') setFilters(prev => ({ ...prev, category: 'All' }));
                      if (chip.key === 'type') setFilters(prev => ({ ...prev, type: 'All' }));
                      if (chip.key === 'workMode') setFilters(prev => ({ ...prev, workMode: 'All' }));
                    }}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Job List Feed */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map(i => <Skeleton key={i} height="160px" borderRadius="16px" />)}
            </div>
          ) : jobs.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Briefcase size={36} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
              <h3>No jobs match your search</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try broadening your search terms or clearing specific filters.</p>
              <Button onClick={clearAllFilters} style={{ marginTop: '1rem' }}>Clear All Filters</Button>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => {
                const isSaved = isJobSaved(job.id);
                return (
                  <Card
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '12px',
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          color: 'white', fontWeight: '800', fontSize: '1.1rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {job.company?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{job.title}</h3>
                            <Badge variant="primary" size="sm">Easy Apply</Badge>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.2rem' }}>
                            {job.company} <CheckCircle2 size={14} color="var(--success)" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleSaveToggle(job.id, e)}
                        aria-label="Save Job"
                        style={{
                          background: isSaved ? 'rgba(239, 68, 68, 0.15)' : 'var(--glass)',
                          border: `1px solid ${isSaved ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)'}`,
                          color: isSaved ? 'var(--danger)' : 'var(--text-muted)',
                          padding: '0.5rem', borderRadius: '8px', cursor: 'pointer'
                        }}
                      >
                        <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Metadata Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <Badge variant="neutral"><MapPin size={12} /> {job.location}</Badge>
                      <Badge variant="primary">{job.workMode || 'Remote'}</Badge>
                      <Badge variant="neutral">{job.type}</Badge>
                      {job.experience && <Badge variant="neutral">{job.experience}</Badge>}
                    </div>

                    {/* Skills Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {job.skills.slice(0, 4).map((s, idx) => (
                          <span key={idx} style={{ background: 'var(--glass)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                      <span style={{ fontWeight: '700', color: 'var(--success)', fontSize: '1rem' }}>{job.salary}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{job.posted}</span>
                        <Button size="sm" variant="secondary">View Details</Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListings;
