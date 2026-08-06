import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'

export default function SearchBar() {
  const searchQuery = useNotesStore((state) => state.searchQuery)
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery)
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const [localValue, setLocalValue] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (localValue !== searchQuery) {
        setSearchQuery(localValue)
      }
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [localValue])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div
        className="absolute inset-0 rounded-2xl blur-md opacity-40 transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
        }}
      />
      <div
        className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border transition-all duration-300 focus-within:border-opacity-100"
        style={{
          borderColor: `${currentTheme.primary}50`,
          boxShadow: `0 0 20px ${currentTheme.primary}20`,
        }}
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300"
          style={{ color: `${currentTheme.primary}80` }}
        />
        <input
          type="text"
          placeholder="搜索笔记标题、内容或标签..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-500 font-rajdhani text-base outline-none"
          style={{ caretColor: currentTheme.primary }}
        />
        {localValue && (
          <button
            onClick={() => {
              setLocalValue('')
              setSearchQuery('')
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            title="清除"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
