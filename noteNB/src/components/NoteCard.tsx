import { memo, useState } from 'react'
import { Trash2, Edit3, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'
import type { Note } from '../types'
import { colorMap } from '../types'
import { formatDate, parseMarkdown } from '../utils/format'

interface NoteCardProps {
  note: Note
  index: number
}

function NoteCardComponent({ note, index }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const updateNote = useNotesStore((state) => state.updateNote)
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const navigate = useNavigate()

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateNote(note.id, {
      completed: !note.completed,
      updatedAt: new Date().toISOString(),
    })
  }

  const colors = colorMap[note.color]

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定要删除这条笔记吗？')) {
      deleteNote(note.id)
    }
  }

  const previewContent = note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content

  return (
    <div
      className={`relative slide-up w-full h-80 transition-all duration-300 ${
        isHovered ? '-translate-y-1' : ''
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden transition-all duration-300 ${colors.bg} border-2 ${colors.border}`}
        style={{
          boxShadow: isHovered ? `0 0 20px ${colors.hex}66, 0 12px 40px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.3)',
          opacity: note.completed ? 0.7 : 1,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
          }}
        />

        <div className="p-5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3 className={`font-orbitron text-lg font-bold line-clamp-1 flex-1 ${note.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
              {note.title || '无标题'}
            </h3>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => navigate(`/note/${note.id}`)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="编辑"
              >
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors group"
                title="删除"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              </button>
            </div>
          </div>

          <div
            className={`font-rajdhani text-sm flex-1 overflow-hidden leading-relaxed card-preview ${note.completed ? 'opacity-60' : 'text-gray-300'}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(previewContent) || '<p>暂无内容</p>' }}
          />

          <div className="mt-3 space-y-2">
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs font-rajdhani border"
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
            {note.dueDate && (
              <div className="flex items-center gap-2" style={{ color: currentTheme.secondary }}>
                <Clock className="w-5 h-5" />
                <span className="font-rajdhani text-base font-bold">截止: {formatDate(note.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-rajdhani">{formatDate(note.updatedAt, true)}</span>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(NoteCardComponent)
