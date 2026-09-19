import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, jobsAPI, applicationsAPI, savedJobsAPI, notificationsAPI, statsAPI, getToken, setToken, removeToken } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem('cf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cf_user');
    }
  }, [user]);

  // Fetch public data on mount
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const data = await jobsAPI.getAll({ limit: 50 });
        setJobs(data.jobs || []);
        setTotalJobs(data.total || 0);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [apps, notifs] = await Promise.all([
        applicationsAPI.getAll().catch(() => []),
        notificationsAPI.getAll().catch(() => []),
      ]);
      setApplications(apps);
      setNotifications(notifs);

      if (user?.role === 'candidate') {
        const saved = await savedJobsAPI.getAll().catch(() => []);
        setSavedJobs(saved);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // Fetch user-specific data when logged in
  useEffect(() => {
    if (user && getToken()) {
      fetchUserData();
    }
  }, [user]);

  // Auth actions
  const register = async (formData) => {
    setError(null);
    const data = await authAPI.register(formData);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    setError(null);
    const data = await authAPI.login(formData);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setApplications([]);
    setSavedJobs([]);
    setNotifications([]);
  };

  // Job actions
  const fetchJobs = useCallback(async (params = {}) => {
    try {
      const data = await jobsAPI.getAll(params);
      setJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
      return data;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      throw err;
    }
  }, []);

  const addJob = async (job) => {
    const newJob = await jobsAPI.create(job);
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };

  // Application actions
  const applyToJob = async (application) => {
    const newApp = await applicationsAPI.create(application);
    setApplications(prev => [...prev, newApp]);
    return newApp;
  };

  // Saved jobs actions
  const saveJob = async (jobId) => {
    await savedJobsAPI.save(jobId);
    const saved = await savedJobsAPI.getAll();
    setSavedJobs(saved);
  };

  const unsaveJob = async (jobId) => {
    await savedJobsAPI.unsave(jobId);
    setSavedJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const isJobSaved = (jobId) => savedJobs.some(j => j.id === jobId);
  const hasApplied = (jobId) => applications.some(a => a.jobId === jobId);

  // Notifications
  const markNotificationRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const refreshNotifications = async () => {
    try {
      const notifs = await notificationsAPI.getAll();
      setNotifications(notifs);
    } catch {}
  };

  return (
    <AppContext.Provider value={{
      user, jobs, totalJobs, applications, savedJobs, notifications, loading, error,
      register, login, logout,
      fetchJobs, addJob,
      applyToJob, hasApplied,
      saveJob, unsaveJob, isJobSaved,
      markNotificationRead, markAllNotificationsRead, unreadCount, refreshNotifications,
      fetchUserData,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const JobProvider = AppProvider;
export const useApp = () => useContext(AppContext);
// Backward compat
export const useJobs = () => useContext(AppContext);
