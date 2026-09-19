require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'careerflow_default_secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data files
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const SAVED_JOBS_FILE = path.join(DATA_DIR, 'saved_jobs.json');
const INTERVIEWS_FILE = path.join(DATA_DIR, 'interviews.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Helper: read/write JSON
const readJSON = async (file) => {
  try { return await fs.readJson(file); }
  catch { return []; }
};
const writeJSON = async (file, data) => await fs.writeJson(file, data, { spaces: 2 });

// Multer config for resume uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.ensureDir(UPLOADS_DIR);
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
});

// Auth middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const users = await readJSON(USERS_FILE);
      req.user = users.find(u => u.id === decoded.id) || null;
    } catch { req.user = null; }
  } else {
    req.user = null;
  }
  next();
};

const normalizeRole = (role) => (role === 'recruiter' ? 'employer' : role);

const requireRole = (role) => (req, res, next) => {
  const userRole = normalizeRole(req.user.role);
  const targetRole = normalizeRole(role);
  if (userRole !== targetRole) return res.status(403).json({ error: 'Access denied' });
  next();
};

// Initialize data
async function initDB() {
  await fs.ensureDir(DATA_DIR);
  await fs.ensureDir(UPLOADS_DIR);

  if (!(await fs.pathExists(USERS_FILE))) await writeJSON(USERS_FILE, []);
  if (!(await fs.pathExists(PROFILES_FILE))) await writeJSON(PROFILES_FILE, []);
  if (!(await fs.pathExists(SAVED_JOBS_FILE))) await writeJSON(SAVED_JOBS_FILE, []);
  if (!(await fs.pathExists(INTERVIEWS_FILE))) await writeJSON(INTERVIEWS_FILE, []);
  if (!(await fs.pathExists(NOTIFICATIONS_FILE))) await writeJSON(NOTIFICATIONS_FILE, []);

  if (!(await fs.pathExists(COMPANIES_FILE))) {
    await writeJSON(COMPANIES_FILE, [
      { id: 'comp_1', name: 'TechNova', industry: 'Technology', location: 'New York, NY', website: 'https://technova.io', size: '201-500', about: 'Building next-generation web applications and cloud solutions.', logo: '', benefits: ['Health Insurance', 'Remote Work', '401(k)', 'Unlimited PTO'], createdBy: null, createdAt: new Date().toISOString() },
      { id: 'comp_2', name: 'CreativeCloud', industry: 'Design & Technology', location: 'San Francisco, CA', website: 'https://creativecloud.co', size: '51-200', about: 'Empowering creators with powerful design tools.', logo: '', benefits: ['Stock Options', 'Gym Membership', 'Catered Meals'], createdBy: null, createdAt: new Date().toISOString() },
      { id: 'comp_3', name: 'DataFlow Systems', industry: 'Data & Analytics', location: 'Remote', website: 'https://dataflow.dev', size: '51-200', about: 'Transforming data into actionable insights.', logo: '', benefits: ['Remote Work', 'Learning Budget', 'Flexible Hours'], createdBy: null, createdAt: new Date().toISOString() },
      { id: 'comp_4', name: 'CloudScale', industry: 'Cloud Infrastructure', location: 'Seattle, WA', website: 'https://cloudscale.io', size: '501-1000', about: 'Enterprise-grade cloud infrastructure solutions.', logo: '', benefits: ['Health Insurance', 'RSUs', 'Parental Leave', 'Education Stipend'], createdBy: null, createdAt: new Date().toISOString() },
      { id: 'comp_5', name: 'AI Insights', industry: 'Artificial Intelligence', location: 'San Francisco, CA', website: 'https://aiinsights.ai', size: '11-50', about: 'Pushing the boundaries of machine learning and AI.', logo: '', benefits: ['Equity', 'Remote Work', 'Conference Budget'], createdBy: null, createdAt: new Date().toISOString() },
      { id: 'comp_6', name: 'AppCraft', industry: 'Mobile Development', location: 'Chicago, IL', website: 'https://appcraft.dev', size: '51-200', about: 'Crafting beautiful mobile experiences.', logo: '', benefits: ['Health Insurance', 'Flexible Schedule', 'Team Retreats'], createdBy: null, createdAt: new Date().toISOString() }
    ]);
  }

  if (!(await fs.pathExists(JOBS_FILE))) {
    await writeJSON(JOBS_FILE, getInitialJobs());
  } else {
    // Upgrade existing jobs with new fields if missing
    const jobs = await readJSON(JOBS_FILE);
    let updated = false;
    const upgradedJobs = jobs.map(job => {
      if (!job.skills) {
        updated = true;
        return { ...getJobDefaults(job), ...job };
      }
      return job;
    });
    if (updated) await writeJSON(JOBS_FILE, upgradedJobs);
  }

  if (!(await fs.pathExists(APPLICATIONS_FILE))) await writeJSON(APPLICATIONS_FILE, []);
}

function getJobDefaults(job) {
  const skillsMap = {
    'Development': ['JavaScript', 'React', 'Node.js'],
    'Design': ['Figma', 'UI/UX', 'Adobe Suite'],
    'Marketing': ['SEO', 'Content Strategy', 'Analytics'],
    'Sales': ['CRM', 'Negotiation', 'Lead Generation']
  };
  return {
    skills: skillsMap[job.category] || ['Communication', 'Problem Solving'],
    workMode: 'Remote',
    experience: '3-5 years',
    responsibilities: ['Collaborate with cross-functional teams', 'Deliver high-quality work on time', 'Participate in code reviews and design sessions'],
    requirements: ['Strong problem-solving skills', 'Excellent communication', 'Relevant experience in the field'],
    preferredQualifications: ['Experience with agile methodologies', 'Strong portfolio or GitHub profile'],
    benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyId: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function getInitialJobs() {
  return [
    { id: 1, title: 'Senior Frontend Developer', company: 'TechNova', companyId: 'comp_1', location: 'New York, NY', salary: '$120k - $160k', type: 'Full-time', workMode: 'Hybrid', experience: '5+ years', description: "We're looking for an experienced Frontend Developer with expertise in React and modern UI/UX principles. You'll build next-generation web applications serving millions of users.", posted: '2 days ago', category: 'Software Development', skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'GraphQL'], responsibilities: ['Build and maintain scalable frontend applications', 'Collaborate with designers and backend engineers', 'Write clean, tested, and well-documented code', 'Mentor junior developers'], requirements: ['5+ years of frontend development experience', 'Expert knowledge of React and TypeScript', 'Experience with state management solutions', 'Strong understanding of web performance optimization'], preferredQualifications: ['Experience with Next.js and SSR', 'GraphQL experience', 'Open source contributions'], benefits: ['Health Insurance', 'Remote Work', '401(k) Match', 'Unlimited PTO', 'Learning Budget'], applicationDeadline: '2026-10-15', status: 'active', createdAt: '2026-09-17T10:00:00Z', updatedAt: '2026-09-17T10:00:00Z' },
    { id: 2, title: 'Product Designer', company: 'CreativeCloud', companyId: 'comp_2', location: 'San Francisco, CA', salary: '$100k - $140k', type: 'Full-time', workMode: 'On-site', experience: '3-5 years', description: 'Design beautiful interfaces for millions of users. We need a creative mind who can translate complex requirements into intuitive designs.', posted: '5 hours ago', category: 'UI/UX', skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'], responsibilities: ['Create wireframes, prototypes, and high-fidelity designs', 'Conduct user research and usability testing', 'Maintain and evolve the design system', 'Present designs to stakeholders'], requirements: ['3+ years of product design experience', 'Expert proficiency in Figma', 'Strong portfolio demonstrating UI/UX skills', 'Understanding of accessibility standards'], preferredQualifications: ['Experience with motion design', 'Knowledge of HTML/CSS', 'Experience in B2B SaaS'], benefits: ['Stock Options', 'Gym Membership', 'Catered Meals', 'Transit Stipend'], applicationDeadline: '2026-10-20', status: 'active', createdAt: '2026-09-19T05:00:00Z', updatedAt: '2026-09-19T05:00:00Z' },
    { id: 3, title: 'Full Stack Engineer', company: 'DataFlow Systems', companyId: 'comp_3', location: 'Remote', salary: '$130k - $170k', type: 'Full-time', workMode: 'Remote', experience: '3-5 years', description: 'Build scalable backend systems and elegant frontends. Experience with Node.js, React, and cloud platforms required.', posted: '1 day ago', category: 'Software Development', skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker'], responsibilities: ['Design and implement full-stack features', 'Optimize application performance', 'Build RESTful APIs and microservices', 'Deploy and manage cloud infrastructure'], requirements: ['3+ years of full-stack development', 'Proficiency in Node.js and React', 'Database design experience', 'Cloud platform experience (AWS/GCP)'], preferredQualifications: ['Experience with Docker and Kubernetes', 'CI/CD pipeline experience', 'Contributions to open source'], benefits: ['Remote Work', 'Learning Budget', 'Flexible Hours', 'Home Office Stipend'], applicationDeadline: '2026-10-10', status: 'active', createdAt: '2026-09-18T10:00:00Z', updatedAt: '2026-09-18T10:00:00Z' },
    { id: 4, title: 'Marketing Manager', company: 'GrowthLabs', companyId: null, location: 'Austin, TX', salary: '$90k - $120k', type: 'Full-time', workMode: 'Hybrid', experience: '3-5 years', description: 'Lead our marketing initiatives and drive user acquisition. Experience with digital marketing, SEO, and content strategy required.', posted: '3 days ago', category: 'Marketing', skills: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Media', 'Email Marketing'], responsibilities: ['Develop and execute marketing strategies', 'Manage social media channels', 'Analyze campaign performance', 'Coordinate with sales team'], requirements: ['3+ years of digital marketing experience', 'Proficiency in Google Analytics and SEO tools', 'Content creation and copywriting skills', 'Data-driven decision making'], preferredQualifications: ['Experience with marketing automation tools', 'B2B marketing background', 'MBA preferred'], benefits: ['Health Insurance', 'Flexible Schedule', 'Performance Bonus'], applicationDeadline: '2026-10-05', status: 'active', createdAt: '2026-09-16T10:00:00Z', updatedAt: '2026-09-16T10:00:00Z' },
    { id: 5, title: 'DevOps Engineer', company: 'CloudScale', companyId: 'comp_4', location: 'Seattle, WA', salary: '$140k - $180k', type: 'Full-time', workMode: 'Remote', experience: '5+ years', description: 'Manage and optimize our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines essential.', posted: '1 week ago', category: 'Cloud / DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'], responsibilities: ['Design and maintain cloud infrastructure', 'Implement CI/CD pipelines', 'Monitor system performance and reliability', 'Automate deployment processes'], requirements: ['5+ years of DevOps experience', 'Expert knowledge of AWS services', 'Container orchestration with Kubernetes', 'Infrastructure as Code experience'], preferredQualifications: ['GCP or Azure experience', 'Security certifications', 'Cost optimization experience'], benefits: ['Health Insurance', 'RSUs', 'Parental Leave', 'Education Stipend', 'Remote Work'], applicationDeadline: '2026-10-12', status: 'active', createdAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T10:00:00Z' },
    { id: 6, title: 'UI/UX Designer', company: 'DesignStudio Pro', companyId: null, location: 'Los Angeles, CA', salary: '$95k - $130k', type: 'Full-time', workMode: 'On-site', experience: '2-4 years', description: 'Create stunning user experiences for web and mobile applications. Strong portfolio and Figma expertise required.', posted: '4 days ago', category: 'UI/UX', skills: ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'CSS'], responsibilities: ['Design mobile and web interfaces', 'Create interactive prototypes', 'Collaborate with engineering teams', 'Conduct A/B testing'], requirements: ['2+ years of UI/UX design experience', 'Strong Figma proficiency', 'Mobile design experience', 'Understanding of design principles'], preferredQualifications: ['Motion design skills', 'Frontend development basics', 'Experience with design tokens'], benefits: ['Health Insurance', 'Creative Leave', 'Team Outings'], applicationDeadline: '2026-10-08', status: 'active', createdAt: '2026-09-15T10:00:00Z', updatedAt: '2026-09-15T10:00:00Z' },
    { id: 7, title: 'Data Scientist', company: 'AI Insights', companyId: 'comp_5', location: 'San Francisco, CA', salary: '$150k - $200k', type: 'Full-time', workMode: 'Hybrid', experience: '3-5 years', description: 'Analyze complex datasets and build machine learning models. PhD or Masters in Data Science, Statistics, or related field preferred.', posted: '6 days ago', category: 'Data Science', skills: ['Python', 'TensorFlow', 'SQL', 'Statistics', 'Machine Learning', 'Pandas'], responsibilities: ['Build and deploy ML models', 'Analyze large-scale datasets', 'Present findings to stakeholders', 'Collaborate with engineering teams'], requirements: ['MS/PhD in Data Science or related field', 'Strong Python and SQL skills', 'Experience with ML frameworks', 'Statistical analysis expertise'], preferredQualifications: ['Published research papers', 'Experience with NLP', 'Cloud ML platform experience'], benefits: ['Equity', 'Remote Work', 'Conference Budget', 'Research Time'], applicationDeadline: '2026-10-18', status: 'active', createdAt: '2026-09-13T10:00:00Z', updatedAt: '2026-09-13T10:00:00Z' },
    { id: 8, title: 'Mobile App Developer', company: 'AppCraft', companyId: 'comp_6', location: 'Chicago, IL', salary: '$110k - $150k', type: 'Full-time', workMode: 'Hybrid', experience: '3-5 years', description: 'Build native mobile applications for iOS and Android. Experience with React Native or Flutter is a plus.', posted: '1 day ago', category: 'Mobile Development', skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'REST APIs'], responsibilities: ['Develop cross-platform mobile applications', 'Optimize app performance', 'Integrate with backend services', 'Publish to App Store and Google Play'], requirements: ['3+ years of mobile development', 'React Native or Flutter experience', 'App Store deployment experience', 'Understanding of mobile UI patterns'], preferredQualifications: ['Native iOS or Android experience', 'CI/CD for mobile apps', 'Performance optimization skills'], benefits: ['Health Insurance', 'Flexible Schedule', 'Team Retreats', 'Device Budget'], applicationDeadline: '2026-10-14', status: 'active', createdAt: '2026-09-18T10:00:00Z', updatedAt: '2026-09-18T10:00:00Z' },
    { id: 9, title: 'ML Engineer Intern', company: 'AI Insights', companyId: 'comp_5', location: 'Remote', salary: '$4,000/month', type: 'Internship', workMode: 'Remote', experience: '0-1 years', description: 'Join our ML team as an intern and work on cutting-edge AI projects. Great opportunity for students and recent graduates.', posted: '3 days ago', category: 'AI / Machine Learning', skills: ['Python', 'PyTorch', 'NumPy', 'Git'], responsibilities: ['Assist in building ML pipelines', 'Prepare and clean datasets', 'Run experiments and document results', 'Learn from senior ML engineers'], requirements: ['Currently pursuing CS/ML degree', 'Basic Python programming', 'Understanding of ML fundamentals', 'Strong desire to learn'], preferredQualifications: ['Personal ML projects', 'Kaggle participation', 'Research experience'], benefits: ['Mentorship', 'Certificate', 'Full-time conversion opportunity'], applicationDeadline: '2026-10-01', status: 'active', createdAt: '2026-09-16T10:00:00Z', updatedAt: '2026-09-16T10:00:00Z' },
    { id: 10, title: 'Cybersecurity Analyst', company: 'CloudScale', companyId: 'comp_4', location: 'Seattle, WA', salary: '$120k - $160k', type: 'Full-time', workMode: 'On-site', experience: '3-5 years', description: 'Protect our cloud infrastructure and customer data from security threats. CISSP or equivalent certification preferred.', posted: '2 days ago', category: 'Cybersecurity', skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Cloud Security', 'Python'], responsibilities: ['Monitor and respond to security incidents', 'Conduct vulnerability assessments', 'Implement security policies', 'Train employees on security best practices'], requirements: ['3+ years of cybersecurity experience', 'Knowledge of OWASP Top 10', 'Experience with SIEM tools', 'Incident response experience'], preferredQualifications: ['CISSP or CISM certification', 'Cloud security certification', 'Bug bounty experience'], benefits: ['Health Insurance', 'RSUs', 'Certification Reimbursement', 'Parental Leave'], applicationDeadline: '2026-10-16', status: 'active', createdAt: '2026-09-17T10:00:00Z', updatedAt: '2026-09-17T10:00:00Z' },
    { id: 11, title: 'Data Analyst Intern', company: 'DataFlow Systems', companyId: 'comp_3', location: 'Remote', salary: '$3,000/month', type: 'Internship', workMode: 'Remote', experience: '0-1 years', description: 'Analyze business data and create insightful dashboards. Perfect for students interested in data analytics.', posted: '1 day ago', category: 'Data Analytics', skills: ['SQL', 'Excel', 'Power BI', 'Python', 'Statistics'], responsibilities: ['Create data reports and dashboards', 'Clean and transform datasets', 'Support data-driven decisions', 'Document data processes'], requirements: ['Pursuing degree in Analytics/CS/Statistics', 'Basic SQL knowledge', 'Excel proficiency', 'Analytical mindset'], preferredQualifications: ['Power BI or Tableau experience', 'Python basics', 'Internship experience'], benefits: ['Mentorship', 'Flexible Hours', 'Full-time conversion'], applicationDeadline: '2026-10-05', status: 'active', createdAt: '2026-09-18T10:00:00Z', updatedAt: '2026-09-18T10:00:00Z' },
    { id: 12, title: 'Product Manager', company: 'TechNova', companyId: 'comp_1', location: 'New York, NY', salary: '$130k - $170k', type: 'Full-time', workMode: 'Hybrid', experience: '5+ years', description: 'Drive product strategy and roadmap for our core platform. Work closely with engineering, design, and business teams.', posted: '5 days ago', category: 'Product Management', skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Roadmapping', 'Stakeholder Management'], responsibilities: ['Define product vision and strategy', 'Prioritize features and manage backlog', 'Analyze user feedback and metrics', 'Coordinate cross-functional teams'], requirements: ['5+ years of product management', 'Experience with agile methodologies', 'Data-driven decision making', 'Technical understanding'], preferredQualifications: ['MBA preferred', 'B2B SaaS experience', 'Experience with product analytics tools'], benefits: ['Health Insurance', 'Remote Work', '401(k) Match', 'Unlimited PTO'], applicationDeadline: '2026-10-20', status: 'active', createdAt: '2026-09-14T10:00:00Z', updatedAt: '2026-09-14T10:00:00Z' }
  ];
}

initDB();

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const userRole = normalizeRole(role);
    if (!['candidate', 'employer'].includes(userRole)) {
      return res.status(400).json({ error: 'Role must be candidate or employer' });
    }

    const users = await readJSON(USERS_FILE);
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: userRole,
      company: userRole === 'employer' ? (company || '') : '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJSON(USERS_FILE, users);

    // Create default profile
    const profiles = await readJSON(PROFILES_FILE);
    profiles.push({
      userId: newUser.id,
      headline: '',
      about: '',
      phone: '',
      location: '',
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      github: '',
      linkedin: '',
      portfolio: '',
      preferredJobType: '',
      preferredLocation: '',
      workMode: '',
      profilePhoto: '',
      updatedAt: new Date().toISOString()
    });
    await writeJSON(PROFILES_FILE, profiles);

    // If employer, create company
    if (role === 'employer' && company) {
      const companies = await readJSON(COMPANIES_FILE);
      const existingCompany = companies.find(c => c.name.toLowerCase() === company.toLowerCase());
      if (!existingCompany) {
        companies.push({
          id: `comp_${uuidv4().slice(0, 8)}`,
          name: company,
          industry: '',
          location: '',
          website: '',
          size: '',
          about: '',
          logo: '',
          benefits: [],
          createdBy: newUser.id,
          createdAt: new Date().toISOString()
        });
        await writeJSON(COMPANIES_FILE, companies);
      }
    }

    // Create welcome notification
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    notifications.push({
      id: uuidv4(),
      userId: newUser.id,
      type: 'welcome',
      title: 'Welcome to CareerFlow!',
      message: `Hi ${name}, your account has been created successfully. ${role === 'candidate' ? 'Start exploring jobs!' : 'Start posting jobs!'}`,
      read: false,
      createdAt: new Date().toISOString()
    });
    await writeJSON(NOTIFICATIONS_FILE, notifications);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// ==================== JOBS ROUTES ====================

app.get('/api/jobs', async (req, res) => {
  try {
    let jobs = await readJSON(JOBS_FILE);
    const { search, location, category, type, workMode, experience, skills, sort, page = 1, limit = 12 } = req.query;

    // Filters
    if (search) {
      const s = search.toLowerCase();
      jobs = jobs.filter(j => j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s) || (j.skills && j.skills.some(sk => sk.toLowerCase().includes(s))));
    }
    if (location) {
      const l = location.toLowerCase();
      jobs = jobs.filter(j => j.location.toLowerCase().includes(l));
    }
    if (category && category !== 'All') jobs = jobs.filter(j => j.category === category);
    if (type && type !== 'All') jobs = jobs.filter(j => j.type === type);
    if (workMode && workMode !== 'All') jobs = jobs.filter(j => j.workMode === workMode);
    if (experience && experience !== 'All') jobs = jobs.filter(j => j.experience === experience);
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim().toLowerCase());
      jobs = jobs.filter(j => j.skills && skillArr.some(s => j.skills.map(sk => sk.toLowerCase()).includes(s)));
    }

    // Only active jobs
    jobs = jobs.filter(j => j.status !== 'closed');

    // Sort
    if (sort === 'newest') jobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sort === 'oldest') jobs.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    const total = jobs.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = jobs.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({ jobs: paginated, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error('Jobs fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const job = jobs.find(j => String(j.id) === String(req.params.id));
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Get company info
    if (job.companyId) {
      const companies = await readJSON(COMPANIES_FILE);
      job.companyInfo = companies.find(c => c.id === job.companyId) || null;
    }

    // Get related jobs
    const related = jobs.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3);
    res.json({ job, relatedJobs: related });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/api/jobs', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const newJob = {
      ...req.body,
      id: Date.now(),
      company: req.body.company || req.user.company || 'Your Company',
      posted: 'Just now',
      status: req.body.status || 'active',
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    jobs.unshift(newJob);
    await writeJSON(JOBS_FILE, jobs);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post job' });
  }
});

app.put('/api/jobs/:id', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const idx = jobs.findIndex(j => String(j.id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Job not found' });
    jobs[idx] = { ...jobs[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSON(JOBS_FILE, jobs);
    res.json(jobs[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.delete('/api/jobs/:id', authenticate, requireRole('employer'), async (req, res) => {
  try {
    let jobs = await readJSON(JOBS_FILE);
    jobs = jobs.filter(j => String(j.id) !== String(req.params.id));
    await writeJSON(JOBS_FILE, jobs);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ==================== APPLICATIONS ROUTES ====================

app.get('/api/applications', authenticate, async (req, res) => {
  try {
    const apps = await readJSON(APPLICATIONS_FILE);
    let filtered;
    if (req.user.role === 'employer') {
      // Employer sees applications to their jobs
      const jobs = await readJSON(JOBS_FILE);
      const myJobIds = jobs.filter(j => j.company === req.user.company || j.createdBy === req.user.id).map(j => j.id);
      filtered = apps.filter(a => myJobIds.includes(a.jobId));
    } else {
      // Candidate sees own applications
      filtered = apps.filter(a => a.userId === req.user.id || a.email === req.user.email);
    }
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', authenticate, async (req, res) => {
  try {
    const apps = await readJSON(APPLICATIONS_FILE);
    // Prevent duplicate applications
    const existing = apps.find(a => (a.userId === req.user.id || a.email === req.user.email) && a.jobId === req.body.jobId);
    if (existing) return res.status(409).json({ error: 'You have already applied to this job' });

    const newApp = {
      ...req.body,
      id: uuidv4(),
      userId: req.user.id,
      email: req.user.email,
      name: req.body.name || req.user.name,
      status: 'Applied',
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    apps.push(newApp);
    await writeJSON(APPLICATIONS_FILE, apps);

    // Create notification for candidate
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    notifications.push({
      id: uuidv4(),
      userId: req.user.id,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your application for ${req.body.jobTitle} at ${req.body.company} has been submitted successfully.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    await writeJSON(NOTIFICATIONS_FILE, notifications);

    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

app.put('/api/applications/:id', authenticate, async (req, res) => {
  try {
    const apps = await readJSON(APPLICATIONS_FILE);
    const idx = apps.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Application not found' });

    const oldStatus = apps[idx].status;
    apps[idx] = { ...apps[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSON(APPLICATIONS_FILE, apps);

    // Notify candidate of status change
    if (req.body.status && req.body.status !== oldStatus) {
      const notifications = await readJSON(NOTIFICATIONS_FILE);
      notifications.push({
        id: uuidv4(),
        userId: apps[idx].userId,
        type: 'status_change',
        title: 'Application Status Updated',
        message: `Your application for ${apps[idx].jobTitle} has been updated to: ${req.body.status}`,
        read: false,
        createdAt: new Date().toISOString()
      });
      await writeJSON(NOTIFICATIONS_FILE, notifications);
    }

    res.json(apps[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// ==================== SAVED JOBS ROUTES ====================

app.get('/api/saved-jobs', authenticate, requireRole('candidate'), async (req, res) => {
  try {
    const saved = await readJSON(SAVED_JOBS_FILE);
    const mySaved = saved.filter(s => s.userId === req.user.id);
    const jobs = await readJSON(JOBS_FILE);
    const savedJobs = mySaved.map(s => {
      const job = jobs.find(j => j.id === s.jobId);
      return job ? { ...job, savedAt: s.savedAt, savedId: s.id } : null;
    }).filter(Boolean);
    res.json(savedJobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

app.post('/api/saved-jobs', authenticate, requireRole('candidate'), async (req, res) => {
  try {
    const saved = await readJSON(SAVED_JOBS_FILE);
    const existing = saved.find(s => s.userId === req.user.id && s.jobId === req.body.jobId);
    if (existing) return res.status(409).json({ error: 'Job already saved' });

    const newSave = {
      id: uuidv4(),
      userId: req.user.id,
      jobId: req.body.jobId,
      savedAt: new Date().toISOString()
    };
    saved.push(newSave);
    await writeJSON(SAVED_JOBS_FILE, saved);
    res.status(201).json(newSave);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save job' });
  }
});

app.delete('/api/saved-jobs/:jobId', authenticate, requireRole('candidate'), async (req, res) => {
  try {
    let saved = await readJSON(SAVED_JOBS_FILE);
    saved = saved.filter(s => !(s.userId === req.user.id && String(s.jobId) === String(req.params.jobId)));
    await writeJSON(SAVED_JOBS_FILE, saved);
    res.json({ message: 'Job unsaved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsave job' });
  }
});

// ==================== PROFILE ROUTES ====================

app.get('/api/users/profile', authenticate, async (req, res) => {
  try {
    const profiles = await readJSON(PROFILES_FILE);
    const profile = profiles.find(p => p.userId === req.user.id);
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword, profile: profile || {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/profile', authenticate, async (req, res) => {
  try {
    const profiles = await readJSON(PROFILES_FILE);
    const idx = profiles.findIndex(p => p.userId === req.user.id);
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...req.body, updatedAt: new Date().toISOString() };
    } else {
      profiles.push({ userId: req.user.id, ...req.body, updatedAt: new Date().toISOString() });
    }
    await writeJSON(PROFILES_FILE, profiles);

    // Update user name if changed
    if (req.body.name) {
      const users = await readJSON(USERS_FILE);
      const userIdx = users.findIndex(u => u.id === req.user.id);
      if (userIdx >= 0) {
        users[userIdx].name = req.body.name;
        await writeJSON(USERS_FILE, users);
      }
    }

    res.json(profiles[idx >= 0 ? idx : profiles.length - 1]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==================== RESUME ROUTES ====================

app.post('/api/resumes', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const profiles = await readJSON(PROFILES_FILE);
    const idx = profiles.findIndex(p => p.userId === req.user.id);
    const resumeData = {
      id: uuidv4(),
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      isPrimary: true
    };

    if (idx >= 0) {
      if (!profiles[idx].resumes) profiles[idx].resumes = [];
      // Set all others to non-primary
      profiles[idx].resumes.forEach(r => r.isPrimary = false);
      profiles[idx].resumes.push(resumeData);
    }
    await writeJSON(PROFILES_FILE, profiles);
    res.status(201).json(resumeData);
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

app.get('/api/resumes', authenticate, async (req, res) => {
  try {
    const profiles = await readJSON(PROFILES_FILE);
    const profile = profiles.find(p => p.userId === req.user.id);
    res.json(profile?.resumes || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

app.delete('/api/resumes/:id', authenticate, async (req, res) => {
  try {
    const profiles = await readJSON(PROFILES_FILE);
    const idx = profiles.findIndex(p => p.userId === req.user.id);
    if (idx >= 0 && profiles[idx].resumes) {
      const resume = profiles[idx].resumes.find(r => r.id === req.params.id);
      if (resume) {
        // Delete file
        const filePath = path.join(__dirname, resume.path);
        if (await fs.pathExists(filePath)) await fs.remove(filePath);
        profiles[idx].resumes = profiles[idx].resumes.filter(r => r.id !== req.params.id);
        await writeJSON(PROFILES_FILE, profiles);
      }
    }
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// ==================== COMPANIES ROUTES ====================

app.get('/api/companies', async (req, res) => {
  try {
    const companies = await readJSON(COMPANIES_FILE);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const companies = await readJSON(COMPANIES_FILE);
    const company = companies.find(c => c.id === req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    // Get company jobs
    const jobs = await readJSON(JOBS_FILE);
    const companyJobs = jobs.filter(j => j.companyId === company.id && j.status !== 'closed');
    res.json({ company, jobs: companyJobs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

app.put('/api/companies/:id', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const companies = await readJSON(COMPANIES_FILE);
    const idx = companies.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Company not found' });
    companies[idx] = { ...companies[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSON(COMPANIES_FILE, companies);
    res.json(companies[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// ==================== INTERVIEWS ROUTES ====================

app.get('/api/interviews', authenticate, async (req, res) => {
  try {
    const interviews = await readJSON(INTERVIEWS_FILE);
    let filtered;
    if (req.user.role === 'employer') {
      filtered = interviews.filter(i => i.recruiterId === req.user.id);
    } else {
      filtered = interviews.filter(i => i.candidateId === req.user.id);
    }
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

app.post('/api/interviews', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const interviews = await readJSON(INTERVIEWS_FILE);
    const newInterview = {
      ...req.body,
      id: uuidv4(),
      recruiterId: req.user.id,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    interviews.push(newInterview);
    await writeJSON(INTERVIEWS_FILE, interviews);

    // Notify candidate
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    notifications.push({
      id: uuidv4(),
      userId: req.body.candidateId,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `You have an interview scheduled for ${req.body.jobTitle} on ${req.body.date} at ${req.body.time}.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    await writeJSON(NOTIFICATIONS_FILE, notifications);

    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

app.put('/api/interviews/:id', authenticate, async (req, res) => {
  try {
    const interviews = await readJSON(INTERVIEWS_FILE);
    const idx = interviews.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Interview not found' });
    interviews[idx] = { ...interviews[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSON(INTERVIEWS_FILE, interviews);
    res.json(interviews[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update interview' });
  }
});

// ==================== NOTIFICATIONS ROUTES ====================

app.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    const myNotifs = notifications.filter(n => n.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(myNotifs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', authenticate, async (req, res) => {
  try {
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    const idx = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    if (idx >= 0) {
      notifications[idx].read = true;
      await writeJSON(NOTIFICATIONS_FILE, notifications);
    }
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.put('/api/notifications/read-all', authenticate, async (req, res) => {
  try {
    const notifications = await readJSON(NOTIFICATIONS_FILE);
    notifications.forEach(n => { if (n.userId === req.user.id) n.read = true; });
    await writeJSON(NOTIFICATIONS_FILE, notifications);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// ==================== STATS ROUTE ====================

app.get('/api/stats', async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const users = await readJSON(USERS_FILE);
    const companies = await readJSON(COMPANIES_FILE);
    const applications = await readJSON(APPLICATIONS_FILE);
    res.json({
      totalJobs: jobs.filter(j => j.status !== 'closed').length,
      totalCandidates: users.filter(u => u.role === 'candidate').length,
      totalCompanies: companies.length,
      totalApplications: applications.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== RECRUITER SPECIFIC ROUTES ====================

app.get('/api/recruiter/jobs', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const myJobs = jobs.filter(j => j.createdBy === req.user.id || j.company === req.user.company);
    res.json(myJobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/recruiter/stats', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const jobs = await readJSON(JOBS_FILE);
    const apps = await readJSON(APPLICATIONS_FILE);
    const interviews = await readJSON(INTERVIEWS_FILE);
    const myJobs = jobs.filter(j => j.createdBy === req.user.id || j.company === req.user.company);
    const myJobIds = myJobs.map(j => j.id);
    const myApps = apps.filter(a => myJobIds.includes(a.jobId));
    const myInterviews = interviews.filter(i => i.recruiterId === req.user.id);

    res.json({
      activeJobs: myJobs.filter(j => j.status === 'active').length,
      totalApplications: myApps.length,
      shortlisted: myApps.filter(a => a.status === 'Shortlisted').length,
      interviews: myInterviews.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/recruiter/candidates', authenticate, requireRole('employer'), async (req, res) => {
  try {
    const apps = await readJSON(APPLICATIONS_FILE);
    const jobs = await readJSON(JOBS_FILE);
    const profiles = await readJSON(PROFILES_FILE);
    const myJobs = jobs.filter(j => j.createdBy === req.user.id || j.company === req.user.company);
    const myJobIds = myJobs.map(j => j.id);
    const myApps = apps.filter(a => myJobIds.includes(a.jobId));

    // Enrich with profile data
    const candidates = myApps.map(app => {
      const profile = profiles.find(p => p.userId === app.userId);
      return { ...app, profile: profile || {} };
    });

    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CareerFlow API running on http://localhost:${PORT}`);
});
