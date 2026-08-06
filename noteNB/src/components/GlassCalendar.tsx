import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'

interface GlassCalendarProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | undefined
  onSelect: (date: string) => void
}

export default function GlassCalendar({ isOpen, onClose, selectedDate, onSelect }: GlassCalendarProps) {
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : today)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDay = firstDayOfMonth.getDay()

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(today)
  }

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day)
    const yearStr = date.getFullYear()
    const monthStr = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(date.getDate()).padStart(2, '0')
    const formattedDate = `${yearStr}-${monthStr}-${dayStr}`
    onSelect(formattedDate)
    onClose()
  }

  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return day === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear()
  }

  const isPast = (day: number) => {
    const date = new Date(year, month, day)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative glass-effect rounded-2xl p-6 w-full max-w-md fade-in-scale"
        style={{
          backgroundColor: `${currentTheme.cardBackground}cc`,
          borderColor: `${currentTheme.primary}40`,
          boxShadow: `0 0 40px ${currentTheme.primary}20`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: currentTheme.primary }} />
          </button>

          <div className="text-center">
            <h3
              className="font-orbitron text-lg font-bold"
              style={{ color: currentTheme.primary }}
            >
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={goToToday}
              className="text-xs font-rajdhani text-gray-500 hover:text-gray-300 transition-colors mt-1"
            >
              今天
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" style={{ color: currentTheme.primary }} />
          </button>
        </div>

        <div className="flex justify-between mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="w-10 h-10 flex items-center justify-center font-rajdhani text-sm text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const past = isPast(day)
            const today = isToday(day)
            const selected = isSelected(day)

            return (
              <button
                key={day}
                onClick={() => !past && handleDateClick(day)}
                disabled={past}
                className={`w-10 h-10 rounded-lg font-rajdhani text-sm transition-all duration-300 ${
                  past ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                } ${today ? 'border' : ''}`}
                style={{
                  backgroundColor: selected ? `${currentTheme.primary}30` : 'transparent',
                  borderColor: today ? `${currentTheme.primary}50` : 'transparent',
                  boxShadow: selected ? `0 0 0 2px ${currentTheme.primary}` : 'none',
                  color: selected ? currentTheme.primary : past ? '#4b5563' : '#e5e7eb',
                }}
              >
                {day}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={() => {
              onSelect('')
              onClose()
            }}
            className="font-rajdhani text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            清除日期
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span className="font-rajdhani text-sm">关闭</span>
          </button>
        </div>
      </div>
    </div>
  )
}
