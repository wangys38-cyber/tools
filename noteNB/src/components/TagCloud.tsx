import { useMemo } from 'react'
import { useNotesStore } from '../store/notesStore'

interface TagCloudProps {
  onTagClick?: (tag: string) => void
}

export default function TagCloud({ onTagClick }: TagCloudProps) {
  const notes = useNotesStore((state) => state.notes)
  const currentTheme = useNotesStore((state) => state.currentTheme)

  const sortedTags = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    for (const note of notes) {
      for (const tag of note.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [notes])

  if (sortedTags.length === 0) return null

  return (
    <div className="mb-8">
      <h3
        className="font-orbitron text-lg font-bold mb-4"
        style={{ color: currentTheme.primary }}
      >
        标签云
      </h3>
      <div className="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => {
          return (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="px-4 py-2 rounded-full font-rajdhani text-sm transition-all duration-300 hover:scale-105 hover:opacity-80"
              style={{
                backgroundColor: `${currentTheme.primary}15`,
                border: `1px solid ${currentTheme.primary}30`,
                color: currentTheme.primary,
              }}
            >
              #{tag} ({count})
            </button>
          )
        })}
      </div>
    </div>
  )
}
