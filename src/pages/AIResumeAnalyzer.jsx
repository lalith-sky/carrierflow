import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle, AlertCircle, ArrowRight, RefreshCw, BarChart2, Award, Zap } from 'lucide-react';
import { useApp } from '../context/JobContext';

const SAMPLE_RESUMES = {
  'Software Engineer': `Jane Doe
Software Developer | React, Node.js, TypeScript
Email: jane.doe@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/janedoe

SUMMARY
Enthusiastic Software Engineer with 3+ years of experience building modern web applications using React, JavaScript, Node.js, and REST APIs. Skilled in writing clean, scalable code and collaborating with cross-functional product teams.

EXPERIENCE
Frontend Developer | TechCorp Inc. (2022 - Present)
- Developed responsive web interfaces using React.js, Tailwind CSS, and Redux Toolkit.
- Improved application page load time by 35% through code splitting and image optimization.
- Collaborated with UX designers to convert Figma mocks into reusable component libraries.

Junior Web Developer | WebCraft Solutions (2020 - 2022)
- Built dynamic web pages using HTML5, CSS3, JavaScript (ES6+), and Bootstrap.
- Integrated third-party APIs and payment gateways.

SKILLS
- Languages: JavaScript, TypeScript, HTML, CSS, SQL
- Frameworks: React.js, Node.js, Express.js
- Tools: Git, GitHub, Docker, Jest, Vite

EDUCATION
B.S. in Computer Science | University of Technology (2020)`,
  
  'Data Analyst': `John Smith
Data Analyst | SQL, Python, Tableau
Email: john.smith@example.com | Portfolio: johnsmithdata.com

SUMMARY
Analytical Data Analyst with 2+ years of experience transforming complex datasets into actionable business insights. Proficient in SQL, Python data processing (Pandas, NumPy), and data visualization with Tableau.

EXPERIENCE
Data Analyst | Insights Co. (2022 - Present)
- Designed automated SQL reporting dashboards serving 50+ internal stakeholders.
- Performed exploratory data analysis on user retention metrics, leading to 12% improvement in churn rate.

EDUCATION
B.S. in Statistics | Tech State University (2021)`
};

const AIResumeAnalyzer = () => {
  const { user } = useApp();
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES['Software Engineer']);
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      // Analyze text keywords
      const textLower = resumeText.toLowerCase();
      
      const techKeywords = ['react', 'javascript', 'typescript', 'node.js', 'sql', 'git', 'api', 'css', 'html', 'python', 'docker'];
      const matchedTech = techKeywords.filter(kw => textLower.includes(kw));

      const actionVerbs = ['developed', 'improved', 'built', 'integrated', 'designed', 'collaborated', 'transformed', 'created', 'managed'];
      const matchedVerbs = actionVerbs.filter(v => textLower.includes(v));

      const hasMetrics = /\d+%|\$\d+|\d+\+|\d+ stakeholders|\d+ years/.test(textLower);

      // Score calculation
      let atsScore = 65;
      if (matchedTech.length >= 4) atsScore += 15;
      if (matchedVerbs.length >= 3) atsScore += 10;
      if (hasMetrics) atsScore += 10;
      atsScore = Math.min(98, atsScore);

      setResult({
        atsScore,
        roleMatch: targetRole,
        strengths: [
          matchedTech.length > 0 ? `Strong technical skill section including ${matchedTech.slice(0, 3).join(', ').toUpperCase()}` : 'Clean structural formatting',
          matchedVerbs.length > 0 ? `Effective use of action verbs (${matchedVerbs.slice(0, 3).join(', ')})` : 'Clear work experience hierarchy',
          hasMetrics ? 'Quantifiable metrics included (e.g. percentages, impact metrics)' : 'Concise summary statement'
        ],
        improvements: [
          !hasMetrics ? 'Add specific numeric achievements (e.g., "Increased performance by 25%")' : 'Include more role-specific keywords matching current job postings',
          matchedTech.length < 5 ? 'Expand skill categories to include testing libraries or CI/CD tools' : 'Optimize formatting to ensure standard section headers',
          'Add links to live portfolio projects or GitHub repositories'
        ],
        missingKeywords: ['CI/CD', 'GraphQL', 'Jest / Testing', 'Agile / Scrum', 'Web Vitals'],
        matchedKeywords: matchedTech.map(t => t.toUpperCase()),
        verdict: atsScore >= 80 ? 'Highly Competitive' : atsScore >= 65 ? 'Good — Minor Tweaks Needed' : 'Needs Optimization'
      });

      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div style={{ padding: '2.5rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(124, 58, 237, 0.12)',
          color: 'var(--primary-color)',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem',
          border: '1px solid rgba(124, 58, 237, 0.25)'
        }}>
          <Sparkles size={16} />
          AI Resume & ATS Scanner
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Instant Resume <span style={{ color: 'var(--primary-color)' }}>AI Feedback</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
          Scan your resume against ATS algorithms, detect missing keywords, and get instant recommendations to boost your match rate.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* Input Card */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.5rem' }}>
              Target Job Title / Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer, Data Analyst"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                Resume Plain Text
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUMES['Software Engineer'])}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sample 1
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUMES['Data Analyst'])}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sample 2
                </button>
              </div>
            </div>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume plain text here..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: isAnalyzing ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Analyzing ATS Factors...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Resume with AI
              </>
            )}
          </button>
        </div>

        {/* Results Card */}
        {result && (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Score header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ATS Match Score</span>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: '700' }}>{result.roleMatch}</h3>
              </div>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: result.atsScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `3px solid ${result.atsScore >= 80 ? '#10B981' : '#F59E0B'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: result.atsScore >= 80 ? '#10B981' : '#F59E0B',
                fontWeight: '800',
                fontSize: '1.4rem'
              }}>
                {result.atsScore}%
              </div>
            </div>

            {/* Verdict badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: result.atsScore >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: result.atsScore >= 80 ? '#10B981' : '#F59E0B',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              <Award size={16} />
              {result.verdict}
            </div>

            {/* Strengths */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#10B981', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={16} /> Key Resume Strengths
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                {result.strengths.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: '0.3rem' }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Improvements */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#F59E0B', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} /> ATS Optimization Opportunities
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                {result.improvements.map((imp, idx) => (
                  <li key={idx} style={{ marginBottom: '0.3rem' }}>{imp}</li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Suggested High-Impact Keywords to Add
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.missingKeywords.map((kw, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResumeAnalyzer;
