import { useNotesStore } from '../store/notesStore'
import ThemeSelector from '../components/ThemeSelector'

export default function Settings() {
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const notesCount = useNotesStore((state) => state.notes.length)

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1
          className="font-orbitron text-4xl font-bold mb-4"
          style={{
            color: currentTheme.primary,
            textShadow: `0 0 10px ${currentTheme.primary}80, 0 0 20px ${currentTheme.primary}60, 0 0 30px ${currentTheme.secondary}40`,
          }}
        >
          设置
        </h1>
        <p className="font-rajdhani text-gray-400 text-lg">自定义你的炫酷体验</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ThemeSelector />
        </div>

        <div className="space-y-6">
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: `${currentTheme.cardBackground}80`,
              borderColor: `${currentTheme.primary}30`,
            }}
          >
            <h3
              className="font-orbitron text-lg font-bold mb-4"
              style={{ color: currentTheme.primary }}
            >
              统计信息
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-gray-400">笔记总数</span>
                <span
                  className="font-orbitron text-2xl font-bold"
                  style={{ color: currentTheme.secondary }}
                >
                  {notesCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-gray-400">存储方式</span>
                <span className="font-rajdhani text-gray-300">本地存储</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-gray-400">当前主题</span>
                <span
                  className="font-rajdhani"
                  style={{ color: currentTheme.primary }}
                >
                  {currentTheme.name}
                </span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: `${currentTheme.cardBackground}80`,
              borderColor: `${currentTheme.primary}30`,
            }}
          >
            <h3
              className="font-orbitron text-lg font-bold mb-4"
              style={{ color: currentTheme.primary }}
            >
              关于
            </h3>
            <p className="font-rajdhani text-gray-400 text-sm leading-relaxed">
              王大锤的超级无敌炫酷记事本是一款具有极致视觉体验的笔记应用。
              采用霓虹赛博朋克风格设计，支持实时搜索、多种主题切换和动画效果。
            </p>
            <p className="font-rajdhani text-gray-500 text-xs mt-4">版本 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
