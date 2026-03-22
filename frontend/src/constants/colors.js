export const SEVERITY_COLORS = {
  NORMAL: '#10B981',
  STRESSED: '#F59E0B',
  DISTRESSED: '#EF4444',
  SAFE: '#10B981',
  CAUTION: '#F59E0B',
  DANGEROUS: '#EF4444',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  CRITICAL: '#7C3AED',
  PENDING: '#64748B',
  UNSAFE: '#EF4444'
};

export const SEVERITY_TAILWIND = {
  NORMAL: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
  STRESSED: 'text-amber-300 border-amber-500/50 bg-amber-500/10',
  DISTRESSED: 'text-red-300 border-red-500/50 bg-red-500/10',
  SAFE: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
  CAUTION: 'text-amber-300 border-amber-500/50 bg-amber-500/10',
  DANGEROUS: 'text-red-300 border-red-500/50 bg-red-500/10',
  WARNING: 'text-amber-300 border-amber-500/50 bg-amber-500/10',
  DANGER: 'text-red-300 border-red-500/50 bg-red-500/10',
  CRITICAL: 'text-violet-300 border-violet-500/50 bg-violet-500/10',
  PENDING: 'text-slate-300 border-slate-500/50 bg-slate-500/10',
  UNSAFE: 'text-red-300 border-red-500/50 bg-red-500/10'
};

export const GAS_THRESHOLDS = {
  H2S: { warning: 10, danger: 20, critical: 30 },
  CH4: { warning: 5, danger: 10, critical: 15 },
  CO: { warning: 35, danger: 70, critical: 120 },
  O2: { warning: 19.5, danger: 18, critical: 16.5, inverse: true },
  NH3: { warning: 25, danger: 50, critical: 90 }
};
