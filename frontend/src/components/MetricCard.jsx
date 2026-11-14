import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'cyan', // cyan, rose, amber, emerald, indigo
  onClick,
}) {
  const accentStyles = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      bgGlow: 'from-cyan-500/10 via-transparent to-transparent',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      valueColor: 'text-cyan-400',
    },
    rose: {
      border: 'border-rose-500/30 hover:border-rose-500/60',
      bgGlow: 'from-rose-500/10 via-transparent to-transparent',
      iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      valueColor: 'text-rose-400',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bgGlow: 'from-amber-500/10 via-transparent to-transparent',
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      valueColor: 'text-amber-400',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bgGlow: 'from-emerald-500/10 via-transparent to-transparent',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    indigo: {
      border: 'border-indigo-500/30 hover:border-indigo-500/60',
      bgGlow: 'from-indigo-500/10 via-transparent to-transparent',
      iconBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      valueColor: 'text-indigo-400',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.cyan;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border ${style.border} bg-[#0B132B]/80 backdrop-blur-md p-5 transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${style.bgGlow} blur-2xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${style.valueColor}`}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`rounded-lg border p-2.5 ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
