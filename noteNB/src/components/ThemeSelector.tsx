import { useState } from 'react'
import { Check, Save, RotateCcw } from 'lucide-react'
import { useNotesStore, themes } from '../store/notesStore'

export default function ThemeSelector() {
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const setTheme = useNotesStore((state) => state.setTheme)
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [saved, setSaved] = useState(false)

  const handleThemeSelect = (theme: typeof themes[0]) => {
    setSelectedTheme(theme)
    setSaved(false)
  }

  const handleSave = () => {
    setTheme(selectedTheme)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setSelectedTheme(currentTheme)
    setSaved(false)
  }

  const hasChanges = selectedTheme.id !== currentTheme.id

  return (
    <div className="space-y-4">
      <h3
        className="font-orbitron text-xl font-bold"
        style={{ color: currentTheme.primary }}
      >
        主题选择
      </h3>
      <p className="text-gray-400 font-rajdhani">选择你的炫酷主题</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] ${
              selectedTheme.id === theme.id ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: selectedTheme.id === theme.id ? theme.primary : 'transparent',
              boxShadow: selectedTheme.id === theme.id ? `0 0 30px ${theme.primary}40` : '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {selectedTheme.id === theme.id && (
              <div
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <Check className="w-5 h-5 text-black" />
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 0 15px ${theme.primary}60`,
                }}
              />
              <div>
                <h4 className="font-orbitron font-bold text-white">{theme.name}</h4>
                <p className="text-gray-500 text-sm font-rajdhani">点击选择</p>
              </div>
            </div>

            <div className="flex gap-2">
              <div
                className="flex-1 h-3 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="flex-1 h-3 rounded-full"
                style={{ backgroundColor: theme.secondary }}
              />
              <div
                className="flex-1 h-3 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
          </button>
        ))}
      </div>

      {hasChanges && (
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border hover:bg-gray-700/50 transition-colors"
            style={{ borderColor: `${currentTheme.primary}30` }}
          >
            <RotateCcw className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <span className="font-rajdhani">取消</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-orbitron font-bold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 0 20px ${currentTheme.primary}50`,
            }}
          >
            <Save className="w-5 h-5" />
            <span>保存主题</span>
          </button>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 fade-in-scale">
          <Check className="w-5 h-5" />
          <span className="font-rajdhani">主题已保存！</span>
        </div>
      )}
    </div>
  )
}
