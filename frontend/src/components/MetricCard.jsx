import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'indigo', // teal, rose, amber, emerald, indigo, cyan
  onClick,
}) {
  const accentStyles = {
    cyan: {
      border: 'border-teal-200/80 hover:border-teal-300',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-800',
      valueColor: 'text-teal-900',
    },
    rose: {
      border: 'border-rose-200/80 hover:border-rose-300',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-800',
      valueColor: 'text-rose-900',
    },
    amber: {
      border: 'border-amber-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-800',
      valueColor: 'text-amber-900',
    },
    emerald: {
      border: 'border-emerald-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      valueColor: 'text-emerald-900',
    },
    indigo: {
      border: 'border-stone-200 hover:border-stone-300',
      iconBg: 'bg-stone-100 border-stone-200 text-stone-800',
      valueColor: 'text-stone-900',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border ${style.border} bg-white p-5 shadow-xs transition-all duration-200 ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${style.valueColor}`}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-stone-500">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`rounded-lg border p-2.5 ${style.iconBg} shadow-2xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
