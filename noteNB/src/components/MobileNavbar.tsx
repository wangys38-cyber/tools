import { Home, Settings, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'

export default function MobileNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTheme = useNotesStore((state) => state.currentTheme)

  const leftNav = { icon: Home, path: '/', label: '首页' }
  const rightNav = { icon: Settings, path: '/settings', label: '设置' }

  const renderNavButton = (item: { icon: typeof Home; path: string; label: string }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className="flex flex-1 flex-col items-center gap-1 transition-all duration-300"
        style={{ color: isActive ? currentTheme.primary : '#9ca3af' }}
      >
        <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
        <span className="text-xs font-rajdhani">{item.label}</span>
      </button>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50">
      <div
        className="glass-effect rounded-t-2xl px-6 py-3 flex items-center justify-around"
        style={{ backgroundColor: `${currentTheme.background}cc` }}
      >
        {renderNavButton(leftNav)}

        <div className="relative -top-6">
          <button
            onClick={() => navigate('/note')}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ripple-effect"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 0 30px ${currentTheme.primary}80`,
            }}
          >
            <Plus className="w-7 h-7 text-black" />
          </button>
        </div>

        {renderNavButton(rightNav)}
      </div>
    </nav>
  )
}
