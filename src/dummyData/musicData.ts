export interface Song {
  id: string;
  title: string;
  duration: string;
  album: string;
  genre: string;
  streams: number;
  releasedDate: string;
  status: 'Published' | 'Under Review' | 'Scheduled' | 'Rejected' | 'Draft';
  isMySong: boolean;
  coverUrl?: string;
  audioUrl?: string;
  artist?: string;
}

export const initialSongs: Song[] = [
  {
    id: "1",
    title: "Tumi Onek Dami",
    duration: "4:20",
    album: "Single",
    genre: "POP",
    streams: 4200000,
    releasedDate: "2026-01-24",
    status: "Published",
    isMySong: false,
    coverUrl: "/bg-images/sidebar_bg.png",
    artist: "Arun Roy"
  },
  {
    id: "2",
    title: "Amar Hote Hote",
    duration: "3:58",
    album: "Amar Hote Hote",
    genre: "Synthwave",
    streams: 2800000,
    releasedDate: "2026-01-24",
    status: "Published",
    isMySong: false,
    coverUrl: "/bg-images/card_bg.png",
    artist: "BeatX Synth"
  },
  {
    id: "3",
    title: "Neon Horizon",
    duration: "4:20",
    album: "Cyber-Neon Dreams",
    genre: "R&B",
    streams: 6800000,
    releasedDate: "2026-01-24",
    status: "Published",
    isMySong: true,
    coverUrl: "/bg-images/navigation_bg.png",
    artist: "Retro Kid"
  },
  {
    id: "4",
    title: "Midnight",
    duration: "4:20",
    album: "Cyber-Neon Dreams",
    genre: "POP",
    streams: 0,
    releasedDate: "",
    status: "Draft",
    isMySong: false,
    coverUrl: "/bg-images/dashboard_bg.png",
    artist: "Nightrider"
  },
  {
    id: "5",
    title: "Tumi Onek Dami",
    duration: "4:20",
    album: "Single",
    genre: "POP",
    streams: 0,
    releasedDate: "2026-01-24",
    status: "Scheduled",
    isMySong: true,
    coverUrl: "/bg-images/sidebar_bg.png",
    artist: "Arun Roy"
  }
];
