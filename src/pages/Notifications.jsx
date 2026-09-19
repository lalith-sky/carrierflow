import React, { useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Calendar, FileText, Briefcase, Check } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Button, Badge, EmptyState } from '../components/ui/UIComponents';

const ICONS = {
  welcome: Bell,
  application_submitted: FileText,
  status_change: AlertCircle,
  interview_scheduled: Calendar,
  shortlisted: CheckCircle,
  job_posted: Briefcase
};

const Notifications = () => {
  const { notifications = [], markNotificationRead, markAllNotificationsRead, refreshNotifications } = useApp();

  useEffect(() => {
    if (typeof refreshNotifications === 'function') {
      refreshNotifications();
    }
  }, [refreshNotifications]);

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Notification <span style={{ color: 'var(--primary)' }}>Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '1rem' }}>
            {unread.length} unread alert{unread.length === 1 ? '' : 's'}
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
            <Check size={16} /> Mark All as Read
          </Button>
        )}
      </div>

      {unread.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Unread Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {unread.map(notif => {
              const Icon = ICONS[notif.type] || Bell;
              return (
                <Card
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  style={{ cursor: 'pointer', background: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{notif.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>{notif.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(notif.createdAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Earlier Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {read.map(notif => {
              const Icon = ICONS[notif.type] || Bell;
              return (
                <Card key={notif.id}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{notif.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 0.35rem 0' }}>{notif.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(notif.createdAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <EmptyState
          title="No notifications"
          description="Updates on application statuses, recruiter views, and scheduled interviews will appear here."
        />
      )}
    </div>
  );
};

export default Notifications;
