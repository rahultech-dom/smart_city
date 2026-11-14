import React from 'react';
import { AlertTriangle, Flame, Info, CheckCircle2 } from 'lucide-react';

const SEVERITY_CONFIGS = {
  critical: {
    label: 'Critical',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
    icon: Flame,
  },
  high: {
    label: 'High',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.2)]',
    icon: Info,
  },
  low: {
    label: 'Low',
    bg: 'bg-slate-500/15',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
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
    <span className={`inline-flex items-center gap-1.5 rounded border ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.glow} ${sizeClasses} font-mono font-medium tracking-wide uppercase`}>
      {showIcon && <Icon className="w-3 h-3 stroke-[2.5]" />}
      <span>{cfg.label}</span>
    </span>
  );
}
