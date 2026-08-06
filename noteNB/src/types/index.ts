export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  color: 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'indigo' | 'teal' | 'rose' | 'amber' | 'cyan' | 'lime' | 'emerald' | 'violet' | 'fuchsia' | 'slate' | 'gray'
  createdAt: string
  updatedAt: string
  dueDate?: string
  completed?: boolean
}

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  cardBackground: string
}

export type ColorKey = 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'indigo' | 'teal' | 'rose' | 'amber' | 'cyan' | 'lime' | 'emerald' | 'violet' | 'fuchsia' | 'slate' | 'gray'

export const colorMap: Record<ColorKey, { bg: string; border: string; glow: string; hex: string }> = {
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]', hex: '#ec4899' },
  blue: { bg: 'bg-cyan-500/10', border: 'border-cyan-500', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]', hex: '#06b6d4' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]', hex: '#22c55e' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]', hex: '#f97316' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]', hex: '#a855f7' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]', hex: '#ef4444' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]', hex: '#eab308' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]', hex: '#6366f1' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500', glow: 'shadow-[0_0_20px_rgba(20,184,166,0.5)]', hex: '#14b8a6' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]', hex: '#f43f5e' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]', hex: '#f59e0b' },
  cyan: { bg: 'bg-cyan-400/10', border: 'border-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.5)]', hex: '#22d3ee' },
  lime: { bg: 'bg-lime-500/10', border: 'border-lime-500', glow: 'shadow-[0_0_20px_rgba(132,204,22,0.5)]', hex: '#84cc16' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]', hex: '#10b981' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]', hex: '#8b5cf6' },
  fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]', hex: '#d946ef' },
  slate: { bg: 'bg-slate-500/10', border: 'border-slate-500', glow: 'shadow-[0_0_20px_rgba(100,116,139,0.5)]', hex: '#64748b' },
  gray: { bg: 'bg-gray-500/10', border: 'border-gray-500', glow: 'shadow-[0_0_20px_rgba(156,163,175,0.5)]', hex: '#9ca3af' },
}
