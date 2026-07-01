import { create } from 'zustand'
import { Song, initialSongs } from '@/dummyData/musicData'

interface MusicState {
  songs: Song[];
  searchQuery: string;
  activeTab: string;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  addSong: (song: Omit<Song, 'id'>) => void;
  editSong: (id: string, updatedFields: Partial<Song>) => void;
  deleteSong: (id: string) => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  songs: initialSongs,
  searchQuery: '',
  activeTab: 'All',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  addSong: (song) => set((state) => ({
    songs: [
      ...state.songs,
      {
        ...song,
        id: Math.random().toString(36).substring(2, 9),
      }
    ]
  })),
  editSong: (id, updatedFields) => set((state) => ({
    songs: state.songs.map((song) => song.id === id ? { ...song, ...updatedFields } : song)
  })),
  deleteSong: (id) => set((state) => ({
    songs: state.songs.filter((song) => song.id !== id)
  }))
}))
