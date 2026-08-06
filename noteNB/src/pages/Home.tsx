import { useMemo } from 'react'
import { FileText, Sparkles, LayoutGrid, List } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'
import SearchBar from '../components/SearchBar'
import NoteCard from '../components/NoteCard'
import ListView from '../components/ListView'
import AddNoteButton from '../components/AddNoteButton'
import TagCloud from '../components/TagCloud'
import ScrollToTop from '../components/ScrollToTop'

export default function Home() {
  const notes = useNotesStore((state) => state.notes)
  const searchQuery = useNotesStore((state) => state.searchQuery)
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery)
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const viewMode = useNotesStore((state) => state.viewMode)
  const setViewMode = useNotesStore((state) => state.setViewMode)

  const filteredNotes = useMemo(() => {
    let result = notes
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return [...result].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, searchQuery])

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
  }

  const completedCount = filteredNotes.filter((n) => n.completed).length

  return (
    <div className="px-6 md:px-12 lg:px-16 pb-32 lg:pb-8">
      <TagCloud onTagClick={handleTagClick} />

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: `${currentTheme.cardBackground}80`, border: `1px solid ${currentTheme.primary}20` }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              style={{
                boxShadow: viewMode === 'grid' ? `0 0 12px ${currentTheme.primary}40` : 'none',
              }}
            >
              <LayoutGrid className="w-5 h-5" style={{ color: viewMode === 'grid' ? currentTheme.primary : '#9ca3af' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              style={{
                boxShadow: viewMode === 'list' ? `0 0 12px ${currentTheme.primary}40` : 'none',
              }}
            >
              <List className="w-5 h-5" style={{ color: viewMode === 'list' ? currentTheme.primary : '#9ca3af' }} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 font-rajdhani text-sm">
          <span className="text-gray-500">{filteredNotes.length} 条</span>
          {completedCount > 0 && (
            <span className="text-green-400/80">{completedCount} 已完成</span>
          )}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 float-gentle"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.secondary}20)`,
              border: `2px solid ${currentTheme.primary}40`,
              boxShadow: `0 0 30px ${currentTheme.primary}30`,
            }}
          >
            <FileText className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="font-orbitron text-xl font-bold text-gray-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.primary }} />
            {searchQuery ? '未找到匹配笔记' : '暂无笔记'}
          </h3>
          <p className="font-rajdhani text-gray-500">
            {searchQuery ? '试试其他关键词' : '点击右下角按钮创建你的第一条笔记'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>
      ) : (
        <ListView notes={filteredNotes} />
      )}

      <AddNoteButton />
      <ScrollToTop />

      <div className="mt-10">
        <SearchBar />
      </div>
    </div>
  )
}
