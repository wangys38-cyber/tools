import { Routes, Route, useLocation } from 'react-router-dom'
import { useNotesStore } from './store/notesStore'
import ParticleBackground from './components/ParticleBackground'
import Header from './components/Header'
import Home from './pages/Home'
import Settings from './pages/Settings'
import NoteEditor from './components/NoteEditor'
import MobileNavbar from './components/MobileNavbar'

export default function App() {
  const currentTheme = useNotesStore((state) => state.currentTheme)
  const location = useLocation()

  const isNotePage = location.pathname.startsWith('/note')

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: currentTheme.background }}
    >
      <ParticleBackground />

      <div className="relative z-10">
        {!isNotePage && <Header />}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<NoteEditor />} />
            <Route path="/note" element={<NoteEditor />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <MobileNavbar />

        {!isNotePage && (
          <footer className="hidden lg:block py-6 text-center">
            <p className="font-rajdhani text-gray-600 text-sm">
              王大锤的超级无敌炫酷记事本
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}
