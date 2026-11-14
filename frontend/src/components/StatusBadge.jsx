import React from 'react';

const STATUS_CONFIGS = {
  submitted: {
    label: 'Submitted',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
    dot: 'bg-sky-600',
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-600 animate-pulse',
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    dot: 'bg-indigo-600',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    dot: 'bg-teal-600 animate-pulse',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    dot: 'bg-rose-600',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const norm = (status || 'submitted').toLowerCase().replace(/\s+/g, '_');
  const cfg = STATUS_CONFIGS[norm] || STATUS_CONFIGS.submitted;

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1 text-xs font-semibold' 
    : 'px-2.5 py-0.5 text-[11px] font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeClasses} font-mono uppercase tracking-wider shadow-2xs`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
