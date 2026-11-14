import React from 'react';
import { Car, ShieldAlert, Trash2, Leaf, Droplets, Zap, Layers } from 'lucide-react';

const DEPT_CONFIGS = {
  traffic: {
    label: 'Traffic',
    icon: Car,
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
  safety: {
    label: 'Public Safety',
    icon: ShieldAlert,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  waste: {
    label: 'Waste Mgmt',
    icon: Trash2,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  environment: {
    label: 'Environment',
    icon: Leaf,
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    text: 'text-teal-400',
  },
  water: {
    label: 'Water Dept',
    icon: Droplets,
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
  },
  energy: {
    label: 'Energy Grid',
    icon: Zap,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  general: {
    label: 'General / Triage',
    icon: Layers,
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
  },
};

export default function DepartmentBadge({ department, size = 'sm' }) {
  const norm = (department || 'general').toLowerCase();
  const cfg = DEPT_CONFIGS[norm] || DEPT_CONFIGS.general;
  const Icon = cfg.icon;

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1 text-xs'
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeClasses} font-medium`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{cfg.label}</span>
    </span>
  );
}
