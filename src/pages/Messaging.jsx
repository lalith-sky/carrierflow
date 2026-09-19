import React, { useState } from 'react';
import { MessageSquare, Send, User, Check, Clock, Search } from 'lucide-react';
import { useApp } from '../context/JobContext';
import { Card, Input, Button } from '../components/ui/UIComponents';

const SAMPLE_CONVERSATIONS = [
  {
    id: 'conv_1',
    name: 'TechNova Recruitment',
    role: 'TechCorp Recruiter',
    avatar: 'T',
    lastMessage: 'We reviewed your application for Senior Frontend Developer and would love to schedule a interview.',
    time: '10:30 AM',
    unread: true,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! Thank you for applying to TechNova.', time: '10:15 AM' },
      { id: 2, sender: 'them', text: 'We reviewed your application for Senior Frontend Developer and would love to schedule an interview.', time: '10:30 AM' }
    ]
  },
  {
    id: 'conv_2',
    name: 'DataFlow Talent Team',
    role: 'Talent Acquisition',
    avatar: 'D',
    lastMessage: 'Your application for Full Stack Engineer has been received.',
    time: 'Yesterday',
    unread: false,
    messages: [
      { id: 1, sender: 'them', text: 'Your application for Full Stack Engineer has been received. Our team will get back to you within 3 business days.', time: 'Yesterday' }
    ]
  }
];

const Messaging = () => {
  const { user } = useApp();
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('conv_1');
  const [newMessage, setNewMessage] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updated = conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: newMessage,
          time: 'Just now',
          messages: [
            ...c.messages,
            { id: Date.now(), sender: 'me', text: newMessage, time: 'Just now' }
          ]
        };
      }
      return c;
    });

    setConversations(updated);
    setNewMessage('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
          Direct <span style={{ color: 'var(--primary)' }}>Messages</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
          Connect directly with hiring managers and candidate talent.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem',
        height: '650px', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        border: '1px solid var(--glass-border)', background: 'var(--bg-card)'
      }}>
        {/* Left Conversation List */}
        <div style={{ borderRight: '1px solid var(--glass-border)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Input icon={Search} placeholder="Search conversations..." style={{ marginBottom: 0 }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                style={{
                  padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: activeConvId === conv.id ? 'var(--primary-light)' : 'transparent',
                  border: `1px solid ${activeConvId === conv.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {conv.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {conv.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{conv.time}</span>
                    </div>
                    <p style={{
                      margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)',
                      textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
                    }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {activeConv.avatar}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{activeConv.name}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{activeConv.role}</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%'
                }}
              >
                <div style={{
                  padding: '0.85rem 1.15rem', borderRadius: '16px',
                  background: msg.sender === 'me' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--glass)',
                  color: msg.sender === 'me' ? 'white' : 'var(--text-main)',
                  border: msg.sender === 'me' ? 'none' : '1px solid var(--glass-border)',
                  fontSize: '0.925rem'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.25rem', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{
                flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)', background: 'var(--glass)',
                color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
              }}
            />
            <Button type="submit" icon={Send}>Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
