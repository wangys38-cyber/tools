import { useEffect, useState, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { useNotesStore } from '../store/notesStore'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const tickingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300)
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } hover:scale-110 active:scale-95 ripple-effect`}
      style={{
        background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
        boxShadow: `0 0 20px ${currentTheme.primary}60`,
      }}
    >
      <ArrowUp className="w-6 h-6 text-black" />
    </button>
  )
}
