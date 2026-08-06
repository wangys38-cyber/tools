import { memo, useMemo } from 'react'
import { useNotesStore } from '../store/notesStore'
import type { Note } from '../types'
import { colorMap } from '../types'
import { Calendar, Clock, Trash2, Edit3, CheckCircle2, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateShort, parseMarkdown } from '../utils/format'

interface ListViewProps {
  notes: Note[]
}

interface GroupedNotes {
  today: Note[]
  tomorrow: Note[]
  thisWeek: Note[]
  nextWeek: Note[]
  later: Note[]
  noDate: Note[]
}

function getDueDateCategory(dueDate: string | undefined): keyof GroupedNotes {
  if (!dueDate) return 'noDate'

  const [year, month, day] = dueDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const endOfWeek = new Date(today)
  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()))
  
  const endOfNextWeek = new Date(endOfWeek)
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 7)

  date.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) return 'today'
  if (date.getTime() === tomorrow.getTime()) return 'tomorrow'
  if (date <= endOfWeek) return 'thisWeek'
  if (date <= endOfNextWeek) return 'nextWeek'
  return 'later'
}

function groupNotesByDueDate(notes: Note[]): GroupedNotes {
  const groups: GroupedNotes = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    later: [],
    noDate: [],
  }

  for (const note of notes) {
    const category = getDueDateCategory(note.dueDate)
    groups[category].push(note)
  }

  return groups
}

const categoryConfig: Record<keyof GroupedNotes, { label: string; icon: typeof Calendar; color: string }> = {
  today: { label: '今天', icon: Clock, color: '#ff6b6b' },
  tomorrow: { label: '明天', icon: Calendar, color: '#feca57' },
  thisWeek: { label: '本周', icon: Calendar, color: '#48dbfb' },
  nextWeek: { label: '下周', icon: Calendar, color: '#1dd1a1' },
  later: { label: '稍后', icon: Calendar, color: '#5f27cd' },
  noDate: { label: '无截止时间', icon: Calendar, color: '#6c757d' },
}

const NoteListItem = memo(function NoteListItem({ note }: { note: Note }) {
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const updateNote = useNotesStore((state) => state.updateNote)
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const navigate = useNavigate()
  const colors = colorMap[note.color]

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要删除这条笔记吗？')) {
      deleteNote(note.id)
    }
  }

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateNote(note.id, {
      completed: !note.completed,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-0.5 ${colors.bg} ${colors.border}`}
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        opacity: note.completed ? 0.7 : 1,
      }}
    >
      <div
        className="w-1.5 self-stretch rounded-full"
        style={{ backgroundColor: colors.hex }}
      />

      <div className="flex-1 min-w-0">
        <h3 className={`font-orbitron font-bold line-clamp-1 mb-1 ${note.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
          {note.title || '无标题'}
        </h3>
        <div
          className={`font-rajdhani text-sm line-clamp-2 list-preview ${note.completed ? 'opacity-60' : 'text-gray-400'}`}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(note.content) || '<p>暂无内容</p>' }}
        />
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full text-xs font-rajdhani border ${note.completed ? 'opacity-50 line-through' : ''}`}
                style={{
                  backgroundColor: `${currentTheme.primary}15`,
                  borderColor: `${currentTheme.primary}40`,
                  color: currentTheme.primary,
                }}
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{note.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {note.dueDate && (
          <div className={`flex items-center gap-2 ${note.completed ? 'text-gray-600' : ''}`} style={{ color: note.completed ? '#6b7280' : currentTheme.secondary }}>
            <Clock className="w-5 h-5" />
            <span className="font-rajdhani text-lg font-bold">{formatDateShort(note.dueDate)}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/note/${note.id}`)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={handleToggleComplete}
            className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: note.completed ? '#22c55e20' : '#4b556320',
              border: `1px solid ${note.completed ? '#22c55e40' : '#6b728040'}`,
            }}
            title={note.completed ? '取消完成' : '标记完成'}
          >
            {note.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
})

export default function ListView({ notes }: ListViewProps) {
  const groupedNotes = useMemo(() => groupNotesByDueDate(notes), [notes])

  const categories: (keyof GroupedNotes)[] = ['today', 'tomorrow', 'thisWeek', 'nextWeek', 'later', 'noDate']

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryNotes = groupedNotes[category]
        if (categoryNotes.length === 0) return null

        const config = categoryConfig[category]
        const Icon = config.icon

        return (
          <div key={category} className="slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${config.color}20`,
                  border: `1px solid ${config.color}40`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <h3 className="font-orbitron font-bold" style={{ color: config.color }}>
                {config.label} ({categoryNotes.length})
              </h3>
            </div>
            
            <div className="space-y-3">
              {categoryNotes.map((note) => (
                <NoteListItem key={note.id} note={note} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
