import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import SavedJobs from './pages/SavedJobs';
import MyApplications from './pages/MyApplications';
import ResumeManager from './pages/ResumeManager';
import PostJob from './pages/PostJob';
import RecruiterApplications from './pages/RecruiterApplications';
import RecruiterCandidates from './pages/RecruiterCandidates';
import RecruiterJobs from './pages/RecruiterJobs';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Interviews from './pages/Interviews';
import Notifications from './pages/Notifications';
import AICareerAssistant from './pages/AICareerAssistant';
import AIInterviewPrep from './pages/AIInterviewPrep';
import AIResumeAnalyzer from './pages/AIResumeAnalyzer';
import CareerRoadmap from './pages/CareerRoadmap';
import JobComparison from './pages/JobComparison';
import Messaging from './pages/Messaging';
import CareerInsights from './pages/CareerInsights';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Auth from './pages/Auth';

function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 160px)' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobListings />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetail />} />
                <Route path="/career-roadmap" element={<CareerRoadmap />} />
                <Route path="/career-insights" element={<CareerInsights />} />
                <Route path="/compare-jobs" element={<JobComparison />} />
                <Route path="/auth" element={<Auth />} />

                {/* Candidate Routes */}
                <Route path="/candidate" element={<CandidateDashboard />} />
                <Route path="/profile" element={<CandidateProfile />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/applications" element={<MyApplications />} />
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/resume" element={<ResumeManager />} />
                <Route path="/resume-manager" element={<ResumeManager />} />

                {/* Shared & Messaging */}
                <Route path="/messages" element={<Messaging />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Recruiter Routes */}
                <Route path="/employer" element={<EmployerDashboard />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
                <Route path="/recruiter/applications" element={<RecruiterApplications />} />
                <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />

                {/* AI Features */}
                <Route path="/ai/career-assistant" element={<AICareerAssistant />} />
                <Route path="/ai-career-assistant" element={<AICareerAssistant />} />
                <Route path="/ai/interview-prep" element={<AIInterviewPrep />} />
                <Route path="/ai-interview-prep" element={<AIInterviewPrep />} />
                <Route path="/ai/resume-analyzer" element={<AIResumeAnalyzer />} />
                <Route path="/ai-resume-analyzer" element={<AIResumeAnalyzer />} />

                {/* Custom Error Pages */}
                <Route path="/403" element={<Forbidden />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </JobProvider>
    </ThemeProvider>
  );
}

export default App;
