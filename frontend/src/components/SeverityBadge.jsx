import React from 'react';
import { AlertTriangle, Flame, Info, CheckCircle2 } from 'lucide-react';

const SEVERITY_CONFIGS = {
  critical: {
    label: 'Critical',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-800 font-bold',
    glow: 'shadow-2xs',
    icon: Flame,
  },
  high: {
    label: 'High',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800 font-semibold',
    glow: 'shadow-2xs',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800 font-medium',
    glow: '',
    icon: Info,
  },
  low: {
    label: 'Low',
    bg: 'bg-stone-100',
    border: 'border-stone-200',
    text: 'text-stone-700 font-medium',
    glow: '',
    icon: CheckCircle2,
  },
};

export default function SeverityBadge({ severity, showIcon = true, size = 'sm' }) {
  const norm = (severity || 'medium').toLowerCase();
  const cfg = SEVERITY_CONFIGS[norm] || SEVERITY_CONFIGS.medium;
  const Icon = cfg.icon;

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1 text-xs'
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.glow} ${sizeClasses} font-mono uppercase tracking-wide`}>
      {showIcon && <Icon className="w-3 h-3 stroke-[2.5]" />}
      <span>{cfg.label}</span>
    </span>
  );
}
