import { Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'

export default function Header() {
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const location = useLocation()

  return (
    <header
      className="relative z-10 py-4 px-3 md:px-6"
      style={{
        background: `linear-gradient(180deg, ${currentTheme.background} 0%, transparent 100%)`,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 0 20px ${currentTheme.primary}40`,
            }}
          >
            <svg viewBox="0 0 48 48" className="w-10 h-10 text-black">
              <ellipse cx="24" cy="40" rx="14" ry="4" fill="#333"/>
              <rect x="20" y="28" width="8" height="14" rx="2" fill="#555"/>
              <ellipse cx="24" cy="24" rx="12" ry="10" fill="#444"/>
              <path d="M14 20 L10 14 L18 18 Z" fill="#666"/>
              <path d="M34 20 L38 14 L30 18 Z" fill="#666"/>
              <circle cx="18" cy="22" r="2" fill="#0ff"/>
              <circle cx="30" cy="22" r="2" fill="#0ff"/>
              <ellipse cx="24" cy="26" rx="3" ry="2" fill="#333"/>
              <circle cx="10" cy="32" r="3" fill="#666"/>
              <circle cx="38" cy="32" r="3" fill="#666"/>
              <circle cx="12" cy="38" r="2" fill="#888"/>
              <circle cx="36" cy="38" r="2" fill="#888"/>
              <ellipse cx="24" cy="12" rx="6" ry="7" fill="#ff6b6b"/>
              <path d="M18 10 L14 4 L20 8 Z" fill="#ff6b6b"/>
              <path d="M30 10 L34 4 L28 8 Z" fill="#ff6b6b"/>
              <circle cx="22" cy="11" r="1" fill="#000"/>
              <circle cx="26" cy="11" r="1" fill="#000"/>
              <ellipse cx="24" cy="15" rx="2" ry="1.5" fill="#333"/>
              <line x1="20" y1="6" x2="16" y2="2" stroke="#0ff" strokeWidth="1"/>
              <line x1="28" y1="6" x2="32" y2="2" stroke="#0ff" strokeWidth="1"/>
              <line x1="20" y1="7" x2="15" y2="4" stroke="#f0f" strokeWidth="1"/>
              <line x1="28" y1="7" x2="33" y2="4" stroke="#f0f" strokeWidth="1"/>
            </svg>
          </div>
          <div className="min-w-0">
            <h1
              className="font-orbitron text-base md:text-2xl font-bold tracking-wider truncate"
              style={{
                color: currentTheme.primary,
                textShadow: `0 0 10px ${currentTheme.primary}80, 0 0 20px ${currentTheme.primary}60, 0 0 30px ${currentTheme.secondary}40`,
              }}
            >
              牛马笔记
            </h1>
            <p className="text-gray-500 text-xs font-rajdhani hidden sm:block">牛马专属记事本</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 shrink-0">
          <Link
            to="/settings"
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/settings' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            style={{
              border: `1px solid ${location.pathname === '/settings' ? currentTheme.primary : 'transparent'}`,
              boxShadow: location.pathname === '/settings' ? `0 0 15px ${currentTheme.primary}30` : 'none',
            }}
          >
            <Settings className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <span className="font-rajdhani text-sm hidden md:inline">设置</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
