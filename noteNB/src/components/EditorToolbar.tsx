import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3, Minus } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'

interface EditorToolbarProps {
  onInsert: (before: string, after: string) => void
}

interface ToolbarItem {
  icon: typeof Bold
  label: string
  before: string
  after: string
}

const toolbarGroups: ToolbarItem[][] = [
  [
    { icon: Heading1, label: '标题1', before: '# ', after: '' },
    { icon: Heading2, label: '标题2', before: '## ', after: '' },
    { icon: Heading3, label: '标题3', before: '### ', after: '' },
  ],
  [
    { icon: Bold, label: '粗体', before: '**', after: '**' },
    { icon: Italic, label: '斜体', before: '*', after: '*' },
    { icon: Strikethrough, label: '中划线', before: '~~', after: '~~' },
    { icon: Code, label: '代码', before: '`', after: '`' },
  ],
  [
    { icon: List, label: '无序列表', before: '- ', after: '' },
    { icon: ListOrdered, label: '有序列表', before: '1. ', after: '' },
    { icon: Quote, label: '引用', before: '> ', after: '' },
  ],
  [
    { icon: Minus, label: '分割线', before: '\n---\n', after: '' },
  ],
]

export default function EditorToolbar({ onInsert }: EditorToolbarProps) {
  const currentTheme = useNotesStore((state) => state.currentTheme)

  const handleClick = (item: ToolbarItem) => {
    onInsert(item.before, item.after)
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 mb-4 rounded-xl"
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: `1px solid ${currentTheme.primary}20`,
      }}
    >
      {toolbarGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="flex items-center gap-1 pr-1 last:pr-0"
          style={{
            borderRight: groupIndex < toolbarGroups.length - 1 ? `1px solid ${currentTheme.primary}20` : 'none',
          }}
        >
          {group.map((item) => {
            const Icon = item.icon
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => handleClick(item)}
                title={item.label}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                style={{ color: '#9ca3af' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = currentTheme.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
