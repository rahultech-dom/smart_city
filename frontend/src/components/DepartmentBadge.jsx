import React from 'react';
import { Car, ShieldAlert, Trash2, Leaf, Droplets, Zap, Layers } from 'lucide-react';

const DEPT_CONFIGS = {
  traffic: {
    label: 'Traffic',
    icon: Car,
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
  },
  safety: {
    label: 'Public Safety',
    icon: ShieldAlert,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  waste: {
    label: 'Waste Mgmt',
    icon: Trash2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
  },
  environment: {
    label: 'Environment',
    icon: Leaf,
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
  },
  water: {
    label: 'Water Dept',
    icon: Droplets,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
  },
  energy: {
    label: 'Energy Grid',
    icon: Zap,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
  general: {
    label: 'General / Triage',
    icon: Layers,
    bg: 'bg-stone-100',
    border: 'border-stone-200',
    text: 'text-stone-700',
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
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeClasses} font-medium shadow-2xs`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{cfg.label}</span>
    </span>
  );
}
