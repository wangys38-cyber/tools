import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note, Theme } from '../types'

export type ViewMode = 'grid' | 'list'

interface NotesStore {
  notes: Note[]
  currentTheme: Theme
  searchQuery: string
  viewMode: ViewMode
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSearchQuery: (query: string) => void
  setTheme: (theme: Theme) => void
  setViewMode: (mode: ViewMode) => void
}

const themes: Theme[] = [
  {
    id: 'cyber-pink',
    name: '赛博粉',
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ff00ff',
    background: '#0a0a0f',
    cardBackground: '#1a1a2e',
  },
  {
    id: 'cyber-blue',
    name: '暗夜蓝',
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#00ffff',
    background: '#050510',
    cardBackground: '#0d1b2a',
  },
  {
    id: 'cyber-green',
    name: '极光绿',
    primary: '#00ff00',
    secondary: '#ff6600',
    accent: '#00ff00',
    background: '#0a0f0a',
    cardBackground: '#1a2e1a',
  },
  {
    id: 'cyber-orange',
    name: '火焰橙',
    primary: '#ff6600',
    secondary: '#ff00ff',
    accent: '#ff6600',
    background: '#100a05',
    cardBackground: '#2e1a0a',
  },
  {
    id: 'cyber-purple',
    name: '幻梦紫',
    primary: '#9900ff',
    secondary: '#00ffff',
    accent: '#9900ff',
    background: '#0f0510',
    cardBackground: '#2e0a40',
  },
  {
    id: 'cyber-dark',
    name: '炫酷黑',
    primary: '#ffffff',
    secondary: '#444444',
    accent: '#888888',
    background: '#000000',
    cardBackground: '#111111',
  },
]

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      currentTheme: themes[5],
      searchQuery: '',
      viewMode: 'grid',
      themes,
      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ notes: [newNote, ...state.notes] }))
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }))
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ currentTheme: theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'cyber-notes-storage',
    }
  )
)

export { themes }
