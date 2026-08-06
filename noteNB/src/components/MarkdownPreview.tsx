import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNotesStore } from '../store/notesStore'

interface MarkdownPreviewProps {
  content: string
}

const parseMarkdown = (text: string): string => {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
  html = html.replace(/<\/ul>\s*<ul>/g, '')

  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>')
  html = html.replace(/<\/ol>\s*<ol>/g, '')

  html = html.replace(/^\s*---\s*$/gim, '<hr>')

  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')

  html = `<p>${html}</p>`

  html = html.replace(/<p><\/p>/g, '')

  return html
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [showPreview, setShowPreview] = useState(true)
  const currentTheme = useNotesStore((state) => state.currentTheme)

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors mb-4"
        style={{
          borderColor: `${currentTheme.primary}30`,
          border: `1px solid ${currentTheme.primary}30`,
        }}
      >
        {showPreview ? (
          <EyeOff className="w-4 h-4" style={{ color: currentTheme.primary }} />
        ) : (
          <Eye className="w-4 h-4" style={{ color: currentTheme.primary }} />
        )}
        <span className="font-rajdhani text-sm" style={{ color: currentTheme.primary }}>
          {showPreview ? '隐藏预览' : 'Markdown预览'}
        </span>
      </button>

      {showPreview && (
        <div
          className="markdown-preview p-6 rounded-xl bg-gray-800/30 border"
          style={{
            borderColor: `${currentTheme.primary}20`,
          }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) || '<p>暂无内容</p>' }}
        />
      )}
    </div>
  )
}
