# 🚀 CareerFlow - Modern Full-Stack Recruitment & Job Platform

CareerFlow is a complete, production-grade SaaS job board and career management platform connecting job seekers with recruiters. Built with React 19, Node.js, Express, and modern CSS, it features dark/light theme switching, AI job matching, resume analysis, direct messaging, interactive career roadmaps, real-time application tracking, and an employer candidate pipeline management system.

![React 19](https://img.shields.io/badge/React-19.2.5-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

---

## ⚡ Quick Start

### 1. Prerequisites Check
- **Node.js**: v16+ (`node --version`)
- **npm**: v8+ (`npm --version`)

### 2. Installation & Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd l2t1

# 2. Install frontend & backend dependencies
npm install
cd backend && npm install && cd ..
```

### 3. Run Development Servers

```bash
# Run both frontend (port 5173) and backend (port 5000) concurrently
npm run dev:all
```

Or run them individually:
```bash
# Terminal 1 - Frontend (http://localhost:5173)
npm run dev

# Terminal 2 - Backend (http://localhost:5000)
npm run server
```

---

## 🌟 Key Features & Architecture

### 👨‍💻 Candidate Features
- **Job Discovery & Search**: Keyword search, location filter, job type (Full-time, Part-time, Internship, Contract), remote/hybrid filters, salary slider, and department chips.
- **AI Job Matching & Resume Analyzer**: Instant candidate skill matching score, resume parsing, ATS compatibility analysis, and career advice assistant.
- **Career Roadmaps & Market Insights**: Step-by-step skill pathways, industry salary benchmarks, in-demand skills, and market trends.
- **Job Comparison Tool**: Side-by-side spec comparison of compensation, culture score, remote flexibility, and growth opportunities.
- **Resume Center**: Multi-resume management, default resume selection, and direct PDF upload.
- **Saved Jobs & Application Tracking**: One-click bookmarking, real-time status updates (Applied, Reviewing, Shortlisted, Interview Scheduled, Offer, Rejected).
- **Direct Messaging**: Instant messaging between candidates and recruiters.

### 🏢 Employer / Recruiter Features
- **Recruiter Dashboard**: Application analytics, candidate pipelines, job post management, and applicant activity feeds.
- **Job Creation & Management**: Publish, edit, pause, and delete job listings with requirement tags.
- **Applicant Pipeline Management**: Review resumes, update applicant status, add recruiter notes, and schedule interviews.
- **Interview Scheduler**: Set interview dates, times, types (Video, Onsite, Technical), link meeting rooms, and send candidate notifications.

### 🎨 Design System & Accessibility
- **Dual Theme Support**: Modern Dark Navy mode & Clean Light mode with instant toggle.
- **Global Search Drawer (`Ctrl + K`)**: Instant keyboard modal to search jobs, companies, skills, and navigate pages.
- **Custom UI Library**: Standardized design system components (`Button`, `Input`, `Select`, `Modal`, `Drawer`, `Card`, `Badge`, `Tabs`, `Skeleton`, `Toast`).
- **Responsive Layout**: Native mobile drawer navigation and fluid grid layouts.

---

## 🏗️ Technical Architecture & Data Flow

```
[ Browser / Client ] 
    │
    ├─► React 19 Components (Vite SPA)
    ├─► ThemeContext (Dark/Light mode) & JobContext (Global state)
    ├─► apiFetch Utility (JWT Authorization)
    │
[ Express REST API Server (Port 5000) ]
    │
    ├─► /api/auth (Login, Register, JWT Bearer Token)
    ├─► /api/jobs (Search, Post, Edit, Delete)
    ├─► /api/applications (Status updates, Recruiter pipeline)
    ├─► /api/resumes (Multer file uploads to /uploads)
    ├─► /api/interviews & /api/notifications
    │
[ Persistent JSON Storage ]
    └── backend/data/*.json (users, jobs, applications, profiles, saved_jobs, interviews, notifications)
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a candidate or recruiter account
- `POST /api/auth/login` — Login & receive JWT authentication token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Jobs
- `GET /api/jobs` — Get job listings (Supports `search`, `location`, `type`, `remote`, `salaryMin`)
- `GET /api/jobs/:id` — Get single job detail
- `POST /api/jobs` — Create new job listing (Employer only)
- `PUT /api/jobs/:id` — Update job listing (Employer only)
- `DELETE /api/jobs/:id` — Delete job listing (Employer only)

### Applications & Pipeline
- `GET /api/applications` — Get user applications (Candidate) or posted job applications (Employer)
- `POST /api/applications` — Submit application with resume & cover letter
- `PUT /api/applications/:id` — Update application status (`reviewing`, `shortlisted`, `rejected`, `hired`)

### Resumes & Saved Jobs
- `GET /api/resumes` — List uploaded candidate resumes
- `POST /api/resumes` — Upload PDF/DOCX resume file (`multipart/form-data`)
- `DELETE /api/resumes/:id` — Delete uploaded resume
- `GET /api/saved-jobs` — Retrieve saved job bookmarks
- `POST /api/saved-jobs` — Save job bookmark
- `DELETE /api/saved-jobs/:id` — Remove job bookmark

### Interviews & Notifications
- `GET /api/interviews` — List scheduled interviews
- `POST /api/interviews` — Schedule interview (Recruiter only)
- `GET /api/notifications` — Fetch user notifications
- `PUT /api/notifications/read-all` — Mark notifications as read

---

## 🚀 Deployment Guide

### Environment Variables

#### Frontend Configuration (`.env` or environment settings)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

#### Backend Configuration (`backend/.env`)
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Deploying Frontend (Vercel / Netlify)
1. Set Build Command: `npm run build`
2. Set Output Directory: `dist`
3. Add Environment Variable: `VITE_API_URL=https://your-backend-api.com/api`

### Deploying Backend (Render / Railway / VPS / Heroku)
1. Set Root Directory: `backend`
2. Set Start Command: `npm start`
3. Add Environment Variables: `PORT`, `JWT_SECRET`, `FRONTEND_URL`

---

## 🛠️ Maintenance & CLI Scripts

```bash
# Build frontend bundle for production
npm run build

# Run Vite preview server
npm run preview

# Execute full automated integration test suite
node scratch/integration_test.js
```

---

## 📄 License
Licensed under the [MIT License](LICENSE).
