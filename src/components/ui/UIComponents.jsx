import React, { useState } from 'react';
import { X, Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info, RefreshCw, Layers } from 'lucide-react';

// Button Component
export const Button = ({ children, variant = 'primary', size = 'md', className = '', style = {}, disabled, onClick, type = 'button', icon: Icon, ariaLabel }) => {
  const baseStyle = {
    padding: size === 'sm' ? '0.4rem 0.85rem' : size === 'lg' ? '0.85rem 1.75rem' : '0.65rem 1.25rem',
    fontSize: size === 'sm' ? '0.85rem' : size === 'lg' ? '1.05rem' : '0.95rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...style
  };

  let variantStyle = {};
  if (variant === 'primary') {
    variantStyle = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff' };
  } else if (variant === 'secondary') {
    variantStyle = { background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' };
  } else if (variant === 'outline') {
    variantStyle = { background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)' };
  } else if (variant === 'danger') {
    variantStyle = { background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' };
  } else if (variant === 'ghost') {
    variantStyle = { background: 'transparent', color: 'var(--text-muted)' };
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn-ui ${className}`}
      style={{ ...baseStyle, ...variantStyle }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ label, error, icon: Icon, style = {}, ...props }) => (
  <div style={{ marginBottom: '1rem', width: '100%' }}>
    {label && <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.4rem' }}>{label}</label>}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />}
      <input
        style={{
          width: '100%',
          padding: Icon ? '0.75rem 1rem 0.75rem 2.75rem' : '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--glass-border)'}`,
          background: 'var(--glass)',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...style
        }}
        {...props}
      />
    </div>
    {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
  </div>
);

// Select Component
export const Select = ({ label, options = [], value, onChange, icon: Icon, style = {}, ...props }) => (
  <div style={{ marginBottom: '1rem', width: '100%' }}>
    {label && <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.4rem' }}>{label}</label>}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: Icon ? '0.75rem 1rem 0.75rem 2.75rem' : '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          background: 'var(--bg-dark)',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          outline: 'none',
          cursor: 'pointer',
          ...style
        }}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Badge Component
export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const styles = {
    primary: { background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)' },
    secondary: { background: 'rgba(168, 85, 247, 0.12)', color: 'var(--secondary)', border: '1px solid rgba(168, 85, 247, 0.25)' },
    success: { background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.25)' },
    warning: { background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.25)' },
    danger: { background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.25)' },
    neutral: { background: 'var(--glass)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
      fontSize: size === 'sm' ? '0.75rem' : '0.825rem',
      fontWeight: '600',
      borderRadius: '6px',
      ...styles[variant]
    }}>
      {children}
    </span>
  );
};

// Card Component
export const Card = ({ children, className = '', style = {}, onClick, hoverable = true }) => (
  <div
    onClick={onClick}
    className={`glass-card ${className}`}
    style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--bg-card)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-sm)',
      cursor: onClick ? 'pointer' : 'default',
      transition: hoverable ? 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' : 'none',
      ...style
    }}
  >
    {children}
  </div>
);

// Modal Component
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '550px', width: '100%',
        boxShadow: 'var(--shadow-lg)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Drawer Component
export const Drawer = ({ isOpen, onClose, title, children, position = 'right' }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: position === 'right' ? 'flex-end' : 'flex-start'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-dark)', borderLeft: '1px solid var(--glass-border)',
        width: '100%', maxWidth: '400px', height: '100%', padding: '1.5rem',
        boxShadow: 'var(--shadow-lg)', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Skeleton Component
export const Skeleton = ({ height = '20px', width = '100%', borderRadius = '8px' }) => (
  <div style={{
    height, width, borderRadius,
    background: 'linear-gradient(90deg, var(--glass) 25%, rgba(255,255,255,0.08) 50%, var(--glass) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-pulse 1.5s infinite ease-in-out'
  }} />
);

// Empty State Component
export const EmptyState = ({ title = 'No items found', description = 'Try adjusting your search or filters.', actionLabel, onAction }) => (
  <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
      <Layers size={28} />
    </div>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{description}</p>
    {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
);

// Alert Component
export const Alert = ({ type = 'info', children }) => {
  const typeMap = {
    info: { icon: Info, color: 'var(--info)', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)' },
    success: { icon: CheckCircle, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
    warning: { icon: AlertTriangle, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)' },
    danger: { icon: AlertTriangle, color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)' },
  };

  const current = typeMap[type];
  const Icon = current.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)',
      background: current.bg, border: `1px solid ${current.border}`,
      color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem'
    }}>
      <Icon size={18} color={current.color} style={{ flexShrink: 0 }} />
      <div>{children}</div>
    </div>
  );
};
