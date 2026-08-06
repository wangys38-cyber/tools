import { useState, useEffect, useRef } from 'react'
import { Save, ArrowLeft, Trash2, Tag, Download, Copy, Check, Calendar, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'
import type { ColorKey } from '../types'
import { colorMap } from '../types'
import MarkdownPreview from './MarkdownPreview'
import GlassCalendar from './GlassCalendar'
import EditorToolbar from './EditorToolbar'

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const notes = useNotesStore((state) => state.notes)
  const addNote = useNotesStore((state) => state.addNote)
  const updateNote = useNotesStore((state) => state.updateNote)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const currentTheme = useNotesStore((state) => state.currentTheme)

  const existingNote = notes.find((n) => n.id === id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [color, setColor] = useState<ColorKey>('pink')
  const [copied, setCopied] = useState(false)
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [showCalendar, setShowCalendar] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cursorPosRef = useRef({ start: 0, end: 0 })

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title)
      setContent(existingNote.content)
      setTags(existingNote.tags.join(', '))
      setColor(existingNote.color)
      setDueDate(existingNote.dueDate)
    }
  }, [existingNote])

  const colors: { key: ColorKey; color: string }[] = [
    { key: 'pink', color: colorMap.pink.hex },
    { key: 'blue', color: colorMap.blue.hex },
    { key: 'green', color: colorMap.green.hex },
    { key: 'orange', color: colorMap.orange.hex },
    { key: 'purple', color: colorMap.purple.hex },
    { key: 'red', color: colorMap.red.hex },
    { key: 'yellow', color: colorMap.yellow.hex },
    { key: 'indigo', color: colorMap.indigo.hex },
    { key: 'teal', color: colorMap.teal.hex },
    { key: 'rose', color: colorMap.rose.hex },
    { key: 'amber', color: colorMap.amber.hex },
    { key: 'cyan', color: colorMap.cyan.hex },
    { key: 'lime', color: colorMap.lime.hex },
    { key: 'emerald', color: colorMap.emerald.hex },
    { key: 'violet', color: colorMap.violet.hex },
    { key: 'fuchsia', color: colorMap.fuchsia.hex },
    { key: 'slate', color: colorMap.slate.hex },
    { key: 'gray', color: colorMap.gray.hex },
  ]

  const handleSave = () => {
    const noteTags = tags.split(',').map((t) => t.trim()).filter(Boolean)

    if (existingNote) {
      updateNote(id!, {
        title: title.trim(),
        content: content.trim(),
        tags: noteTags,
        color,
        dueDate: dueDate || undefined,
      })
    } else {
      addNote({
        title: title.trim(),
        content: content.trim(),
        tags: noteTags,
        color,
        dueDate: dueDate || undefined,
      })
    }

    navigate('/')
  }

  const handleDelete = () => {
    if (existingNote && confirm('确定要删除这条笔记吗？')) {
      deleteNote(existingNote.id)
      navigate('/')
    }
  }

  const handleExport = () => {
    const noteData = {
      title: title || '无标题',
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      color,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(noteData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${noteData.title}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    const text = `标题: ${title || '无标题'}\n\n${content}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportFeishu = () => {
    const feishuContent = `# ${title || '无标题'}

${content || '暂无内容'}

---

**标签**: ${tags.split(',').map((t) => t.trim()).filter(Boolean).join('、') || '无'}
${dueDate ? `**完成时间**: ${new Date(dueDate).toLocaleDateString('zh-CN')}` : ''}
${existingNote ? `**创建时间**: ${new Date(existingNote.createdAt).toLocaleDateString('zh-CN')}` : ''}
**最后修改**: ${new Date(existingNote?.updatedAt || Date.now()).toLocaleDateString('zh-CN')}`

    const blob = new Blob([feishuContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || '无标题'}.md`
    a.click()
    URL.revokeObjectURL(url)

    alert('笔记已导出为 Markdown 文件，可直接导入飞书文档！')
  }

  const handleInsert = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = cursorPosRef.current.start
    const end = cursorPosRef.current.end
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 pb-24 lg:pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" style={{ color: currentTheme.primary }} />
          <span className="font-rajdhani text-gray-300">返回</span>
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 border hover:bg-gray-700/50 transition-colors"
            style={{ borderColor: `${currentTheme.primary}30` }}
            title="复制"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" style={{ color: currentTheme.primary }} />
            )}
            <span className="font-rajdhani text-sm hidden sm:inline">{copied ? '已复制' : '复制'}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 border hover:bg-gray-700/50 transition-colors"
            style={{ borderColor: `${currentTheme.primary}30` }}
            title="导出"
          >
            <Download className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <span className="font-rajdhani text-sm hidden sm:inline">导出</span>
          </button>
          <button
            onClick={handleExportFeishu}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-colors"
            title="导出飞书文档"
          >
            <Send className="w-5 h-5" />
            <span className="font-rajdhani text-sm hidden sm:inline">飞书</span>
          </button>
          {existingNote && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
              title="删除"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-rajdhani text-sm hidden sm:inline">删除</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-orbitron font-bold text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              boxShadow: `0 0 20px ${currentTheme.primary}50`,
            }}
          >
            <Save className="w-5 h-5" />
            <span>保存</span>
          </button>
        </div>
      </div>

      <div
        className="backdrop-blur-xl rounded-2xl border p-5 md:p-8 transition-all duration-300 fade-in-scale"
        style={{
          backgroundColor: 'rgba(50, 50, 50, 0.7)',
          borderColor: 'rgba(100, 100, 100, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <input
          type="text"
          placeholder="输入标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl md:text-3xl font-orbitron font-bold text-white bg-transparent placeholder-gray-600 outline-none mb-5"
          style={{ caretColor: currentTheme.primary }}
        />

        <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-700/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Tag className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="标签（用逗号分隔）..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800/50 rounded-lg border text-white placeholder-gray-500 font-rajdhani outline-none transition-all focus:border-opacity-100"
                style={{ borderColor: `${currentTheme.primary}30` }}
              />
            </div>

            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border font-rajdhani font-bold transition-all hover:bg-gray-700/50 shrink-0"
              style={{
                borderColor: `${currentTheme.primary}50`,
                color: dueDate ? currentTheme.primary : '#d1d5db',
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>{dueDate ? new Date(dueDate).toLocaleDateString('zh-CN') : '完成时间'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 text-sm font-rajdhani shrink-0">颜色</span>
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
        </div>

        <EditorToolbar onInsert={handleInsert} />

        <textarea
          ref={textareaRef}
          placeholder="开始编写你的笔记...支持 Markdown 格式"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement
            cursorPosRef.current = { start: target.selectionStart, end: target.selectionEnd }
          }}
          onFocus={(e) => {
            const target = e.target as HTMLTextAreaElement
            cursorPosRef.current = { start: target.selectionStart, end: target.selectionEnd }
          }}
          onKeyUp={(e) => {
            const target = e.target as HTMLTextAreaElement
            cursorPosRef.current = { start: target.selectionStart, end: target.selectionEnd }
          }}
          rows={12}
          className="w-full text-base md:text-lg font-rajdhani text-gray-300 bg-transparent placeholder-gray-600 outline-none resize-none leading-relaxed"
          style={{ caretColor: currentTheme.primary }}
        />

        <MarkdownPreview content={content} />

        <div className="mt-6 pt-5 border-t border-gray-700/50">
          <div className="flex flex-wrap items-center justify-between gap-3 text-gray-500 text-sm font-rajdhani">
            <span>{content.length} 字符</span>
            <span>{content.split(/\s+/).filter(Boolean).length} 单词</span>
            {dueDate && (
              <span>完成时间: {new Date(dueDate).toLocaleDateString('zh-CN')}</span>
            )}
            {existingNote && (
              <span>最后修改: {new Date(existingNote.updatedAt).toLocaleDateString('zh-CN')}</span>
            )}
          </div>
        </div>
      </div>

      <GlassCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={dueDate}
        onSelect={(date) => setDueDate(date || undefined)}
      />
    </div>
  )
}
