import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'
import type { ColorKey } from '../types'
import { colorMap } from '../types'

export default function AddNoteButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [color, setColor] = useState<ColorKey>('pink')
  const addNote = useNotesStore((state) => state.addNote)
  const currentTheme = useNotesStore((state) => state.currentTheme)

  const colors: { key: ColorKey; color: string }[] = (Object.keys(colorMap) as ColorKey[]).map((key) => ({
    key,
    color: colorMap[key].hex,
  }))

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return

    addNote({
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      color,
    })

    setTitle('')
    setContent('')
    setTags('')
    setColor('pink')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`absolute bottom-20 right-0 w-80 bg-gray-900/95 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          borderColor: `${currentTheme.primary}50`,
          boxShadow: `0 0 30px ${currentTheme.primary}30`,
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-orbitron text-lg font-bold"
              style={{ color: currentTheme.primary }}
            >
              创建新笔记
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border text-white placeholder-gray-500 font-rajdhani outline-none transition-all focus:border-opacity-100"
              style={{ borderColor: `${currentTheme.primary}30` }}
            />

            <textarea
              placeholder="内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border text-white placeholder-gray-500 font-rajdhani outline-none transition-all resize-none focus:border-opacity-100"
              style={{ borderColor: `${currentTheme.primary}30` }}
            />

            <input
              type="text"
              placeholder="标签（用逗号分隔）..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border text-white placeholder-gray-500 font-rajdhani outline-none transition-all focus:border-opacity-100"
              style={{ borderColor: `${currentTheme.primary}30` }}
            />

            <div>
              <p className="text-gray-400 text-sm mb-2 font-rajdhani">选择颜色</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c.key)}
                    className={`w-7 h-7 rounded-full transition-all duration-200 ${color === c.key ? 'scale-110 ring-2 ring-white/50' : 'hover:scale-105'}`}
                    style={{
                      backgroundColor: c.color,
                      boxShadow: color === c.key ? `0 0 12px ${c.color}80` : 'none',
                    }}
                    title={c.key}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl font-orbitron font-bold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                boxShadow: `0 0 20px ${currentTheme.primary}50`,
              }}
            >
              创建笔记
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ripple-effect"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
          boxShadow: `0 0 30px ${currentTheme.primary}60`,
        }}
      >
        <Plus className={`w-8 h-8 text-black transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
    </div>
  )
}
