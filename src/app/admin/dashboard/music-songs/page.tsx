"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    HeadphonesIcon,
    MusicNote01Icon,
    Clock01Icon,
    Add01Icon,
    Upload01Icon,
    PencilEdit01Icon,
    Delete01Icon,
    EyeIcon,
    Search01Icon,
    CheckmarkCircle01Icon
} from "@hugeicons/core-free-icons"
import { useMusicStore } from "@/store/useMusicStore"
import { Song } from "@/dummyData/musicData"
import { cn } from "@/lib/utils"
import MusicDetails from "@/components/admin/musicManagement/MusicDetails"

export default function AdminDashboardMusicManagementPage() {
    const {
        songs,
        searchQuery,
        activeTab,
        setSearchQuery,
        setActiveTab,
        addSong,
        editSong,
        deleteSong
    } = useMusicStore()

    // Selection state for checkboxes
    const [selectedSongIds, setSelectedSongIds] = useState<string[]>([])

    // Modal open states
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    // Active item being edited/viewed/deleted
    const [activeSong, setActiveSong] = useState<Song | null>(null)

    // Form inputs for add/edit
    const [formTitle, setFormTitle] = useState("")
    const [formArtist, setFormArtist] = useState("")
    const [formAlbum, setFormAlbum] = useState("")
    const [formGenre, setFormGenre] = useState("POP")
    const [formDuration, setFormDuration] = useState("4:20")
    const [formReleasedDate, setFormReleasedDate] = useState("2026-01-24")
    const [formStatus, setFormStatus] = useState<Song["status"]>("Published")
    const [formIsMySong, setFormIsMySong] = useState(false)
    const [formError, setFormError] = useState("")

    // Form reset helper
    const resetForm = () => {
        setFormTitle("")
        setFormArtist("")
        setFormAlbum("")
        setFormGenre("POP")
        setFormDuration("4:20") 
        setFormReleasedDate("2026-01-24")
        setFormStatus("Published")
        setFormIsMySong(false)
        setFormError("")
        setActiveSong(null)
    }

    // Populate form helper for edit
    const populateForm = (song: Song) => {
        setFormTitle(song.title)
        setFormArtist(song.artist || "")
        setFormAlbum(song.album)
        setFormGenre(song.genre)
        setFormDuration(song.duration)
        setFormReleasedDate(song.releasedDate || "")
        setFormStatus(song.status)
        setFormIsMySong(song.isMySong)
        setFormError("")
        setActiveSong(song)
    }

    // Dynamic stats calculations
    const stats = useMemo(() => {
        const totalSongs = songs.length
        const totalStreams = songs.reduce((sum, s) => sum + s.streams, 0)
        const publishedCount = songs.filter(s => s.status === "Published").length
        const awaitingReviewCount = songs.filter(s => s.status === "Under Review").length

        // Formatter for streams (e.g. 22.6M)
        const formatStreams = (num: number) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + "M"
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + "K"
            }
            return num.toString()
        }

        return {
            totalSongs,
            totalStreams: formatStreams(totalStreams),
            publishedCount,
            awaitingReviewCount
        }
    }, [songs])

    // Filter and search logic
    const filteredSongs = useMemo(() => {
        return songs.filter(song => {
            // Tab filter
            if (activeTab === "Published" && song.status !== "Published") return false
            if (activeTab === "Under Review" && song.status !== "Under Review") return false
            if (activeTab === "Scheduled" && song.status !== "Scheduled") return false
            if (activeTab === "Rejected" && song.status !== "Rejected") return false
            if (activeTab === "My Songs" && !song.isMySong) return false

            // Search query filter
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase()
                const matchesTitle = song.title.toLowerCase().includes(query)
                const matchesArtist = (song.artist || "").toLowerCase().includes(query)
                const matchesAlbum = song.album.toLowerCase().includes(query)
                const matchesGenre = song.genre.toLowerCase().includes(query)
                return matchesTitle || matchesArtist || matchesAlbum || matchesGenre
            }

            return true
        })
    }, [songs, activeTab, searchQuery])

    // Checkbox selection helpers
    const toggleSelectAll = () => {
        if (selectedSongIds.length === filteredSongs.length) {
            setSelectedSongIds([])
        } else {
            setSelectedSongIds(filteredSongs.map(s => s.id))
        }
    }

    const toggleSelectSong = (id: string) => {
        if (selectedSongIds.includes(id)) {
            setSelectedSongIds(selectedSongIds.filter(item => item !== id))
        } else {
            setSelectedSongIds([...selectedSongIds, id])
        }
    }

    // CRUD Submission handlers
    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formTitle.trim()) {
            setFormError("Song Title is required.")
            return
        }
        if (!formArtist.trim()) {
            setFormError("Artist Name is required.")
            return
        }

        const newSong: Omit<Song, "id"> = {
            title: formTitle,
            artist: formArtist,
            album: formAlbum || "Single",
            genre: formGenre,
            duration: formDuration || "3:30",
            releasedDate: formReleasedDate,
            status: formStatus,
            isMySong: formIsMySong,
            streams: 0,
            coverUrl: "/bg-images/sidebar_bg.png"
        }

        addSong(newSong)
        setIsUploadModalOpen(false)
        resetForm()
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeSong) return
        if (!formTitle.trim()) {
            setFormError("Song Title is required.")
            return
        }
        if (!formArtist.trim()) {
            setFormError("Artist Name is required.")
            return
        }

        editSong(activeSong.id, {
            title: formTitle,
            artist: formArtist,
            album: formAlbum || "Single",
            genre: formGenre,
            duration: formDuration,
            releasedDate: formReleasedDate,
            status: formStatus,
            isMySong: formIsMySong
        })

        setIsEditModalOpen(false)
        resetForm()
    }

    const handleDeleteConfirm = () => {
        if (!activeSong) return
        deleteSong(activeSong.id)
        setSelectedSongIds(selectedSongIds.filter(id => id !== activeSong.id))
        setIsDeleteConfirmOpen(false)
        resetForm()
    }

    return (
        <div className="flex flex-col gap-6 text-white w-full">
            {/* 1. Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Songs Card */}
                <div 
                    style={{
                        background: "var(--card-bg-style)",
                    }}
                    className="border border-light-whitetext/15 backdrop-blur-md rounded-[16px] p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-secondary/30 transition-all duration-300"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full border border-secondary/30 bg-secondary/10 text-secondary">
                        <HugeiconsIcon icon={HeadphonesIcon} className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold font-['Space_Grotesk'] tracking-tight">
                            {stats.totalSongs}
                        </div>
                        <div className="text-white/60 text-xs font-medium mt-1">
                            Total Songs
                        </div>
                    </div>
                </div>

                {/* Total Streams Card */}
                <div 
                    style={{
                        background: "var(--card-bg-style)",
                    }}
                    className="border border-light-whitetext/15 backdrop-blur-md rounded-[16px] p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full border border-primary/30 bg-primary/10 text-primary">
                        <HugeiconsIcon icon={MusicNote01Icon} className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold font-['Space_Grotesk'] tracking-tight">
                            {stats.totalStreams}
                        </div>
                        <div className="text-white/60 text-xs font-medium mt-1">
                            Total Streams
                        </div>
                    </div>
                </div>

                {/* Published Card */}
                <div 
                    style={{
                        background: "var(--card-bg-style)",
                    }}
                    className="border border-light-whitetext/15 backdrop-blur-md rounded-[16px] p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-green-success/30 transition-all duration-300"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full border border-green-success/30 bg-green-success/10 text-green-success">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold font-['Space_Grotesk'] tracking-tight">
                            {stats.publishedCount}
                        </div>
                        <div className="text-white/60 text-xs font-medium mt-1">
                            Published
                        </div>
                    </div>
                </div>

                {/* Awaiting Review Card */}
                <div 
                    style={{
                        background: "var(--card-bg-style)",
                    }}
                    className="border border-light-whitetext/15 backdrop-blur-md rounded-[16px] p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-yelow-warning/30 transition-all duration-300"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full border border-yelow-warning/30 bg-yelow-warning/10 text-yelow-warning">
                        <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold font-['Space_Grotesk'] tracking-tight">
                            {stats.awaitingReviewCount}
                        </div>
                        <div className="text-white/60 text-xs font-medium mt-1">
                            Awaiting Review
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Upload Song Banner */}
            <div 
                style={{
                    backgroundImage: "var(--upload-banner-bg)"
                }}
                className="border border-button-text/30 bg-dark-accent/30 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full backdrop-blur-sm"
            >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center justify-center h-12 w-12 rounded-[14px] bg-secondary/10 border border-secondary/20 text-secondary shrink-0">
                        <HugeiconsIcon icon={Upload01Icon} className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-white font-medium text-base font-['Space_Grotesk'] leading-tight">
                            Upload New Song
                        </h2>
                        <p className="text-white/40 text-xs mt-1 leading-normal truncate">
                            MP3 / WAV / FLAC · Max 100MB · Cover art min 1000×1000px
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        resetForm()
                        setIsUploadModalOpen(true)
                    }}
                    className="flex items-center justify-center gap-1.5 bg-secondary text-button-text hover:bg-secondary/90 transition-all font-semibold rounded-full px-5 py-2.5 text-sm w-full sm:w-auto cursor-pointer shrink-0"
                >
                    <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" strokeWidth={2.5} />
                    Upload Song
                </button>
            </div>

            {/* 3. Filter Tabs and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mt-2">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 no-scrollbar">
                    {["All", "Published", "Under Review", "Scheduled", "Rejected", "My Songs"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer",
                                activeTab === tab
                                    ? "bg-secondary text-button-text border-secondary"
                                    : "bg-dark-accent/30 text-white/60 border-light-whitetext/10 hover:border-light-whitetext/25 hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                        <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" strokeWidth={2} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search ....."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-search-btn-bg text-white placeholder-white/40 rounded-full border border-light-whitetext/10 focus:outline-none focus:border-secondary/40 backdrop-blur-md transition-all duration-150"
                    />
                </div>
            </div>

            {/* 4. Songs Table */}
            <div className="w-full bg-dark-accent/25 border border-light-whitetext/10 rounded-[16px] overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-light-whitetext/10 text-white/60 text-xs font-semibold uppercase tracking-wider bg-dark-accent/10">
                                <th className="py-4 px-5 w-12 text-center">
                                    <button 
                                        onClick={toggleSelectAll}
                                        className={cn(
                                            "h-4 w-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                                            selectedSongIds.length === filteredSongs.length && filteredSongs.length > 0
                                                ? "border-secondary bg-secondary text-button-text"
                                                : "border-light-whitetext/30 bg-transparent"
                                        )}
                                    >
                                        {selectedSongIds.length === filteredSongs.length && filteredSongs.length > 0 && (
                                            <span className="text-[10px] font-bold">✓</span>
                                        )}
                                    </button>
                                </th>
                                <th className="py-4 px-4 font-medium text-white/50">Songs</th>
                                <th className="py-4 px-4 font-medium text-white/50">Album</th>
                                <th className="py-4 px-4 font-medium text-white/50">Genre</th>
                                <th className="py-4 px-4 font-medium text-white/50">Streams</th>
                                <th className="py-4 px-4 font-medium text-white/50">Released</th>
                                <th className="py-4 px-4 font-medium text-white/50">Status</th>
                                <th className="py-4 px-5 text-right font-medium text-white/50">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-whitetext/5">
                            {filteredSongs.length > 0 ? (
                                filteredSongs.map((song) => (
                                    <tr key={song.id} className="hover:bg-light-whitetext/[0.02] transition-colors">
                                        {/* Checkbox */}
                                        <td className="py-4 px-5 text-center">
                                            <button 
                                                onClick={() => toggleSelectSong(song.id)}
                                                className={cn(
                                                    "h-4 w-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                                                    selectedSongIds.includes(song.id)
                                                        ? "border-secondary bg-secondary text-button-text"
                                                        : "border-light-whitetext/30 bg-transparent"
                                                )}
                                            >
                                                {selectedSongIds.includes(song.id) && (
                                                    <span className="text-[10px] font-bold">✓</span>
                                                )}
                                            </button>
                                        </td>

                                        {/* Song Info */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-[8px] bg-secondary/10 overflow-hidden shrink-0 border border-light-whitetext/10">
                                                    {song.coverUrl ? (
                                                        <img 
                                                            src={song.coverUrl} 
                                                            alt={song.title} 
                                                            className="h-full w-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-secondary">
                                                            <HugeiconsIcon icon={MusicNote01Icon} className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-white font-medium text-sm truncate">{song.title}</span>
                                                    <span className="text-white/40 text-xs mt-0.5 truncate">{song.duration}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Album */}
                                        <td className="py-4 px-4 text-white/80 text-sm">
                                            {song.album}
                                        </td>

                                        {/* Genre */}
                                        <td className="py-4 px-4">
                                            <span className="inline-block px-3 py-1 rounded-full border border-light-whitetext/20 text-white/70 text-[10px] font-semibold tracking-wider uppercase">
                                                {song.genre}
                                            </span>
                                        </td>

                                        {/* Streams */}
                                        <td className="py-4 px-4 text-sm font-medium">
                                            {song.streams > 0 ? (
                                                <span className="text-green-success flex items-center gap-1">
                                                    <span>↗</span>
                                                    <span>
                                                        {song.streams >= 1000000 
                                                            ? (song.streams / 1000000).toFixed(1) + "M"
                                                            : song.streams.toLocaleString()
                                                        }
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-white/30 flex items-center gap-1">
                                                    <span>↗</span>
                                                    <span>0</span>
                                                </span>
                                            )}
                                        </td>

                                        {/* Released Date */}
                                        <td className="py-4 px-4 text-white/50 text-sm">
                                            {song.releasedDate || "-"}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium border",
                                                song.status === "Published" && "bg-green-success/10 text-green-success border-green-success/20",
                                                song.status === "Draft" && "bg-white/5 text-white/40 border-light-whitetext/10",
                                                song.status === "Scheduled" && "bg-yelow-warning/10 text-yelow-warning border-yelow-warning/20",
                                                song.status === "Under Review" && "bg-primary/10 text-primary border-primary/20",
                                                song.status === "Rejected" && "bg-red-error/10 text-red-error border-red-error/20"
                                            )}>
                                                {song.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Details Button */}
                                                <button
                                                    onClick={() => {
                                                        setActiveSong(song)
                                                        setIsDetailsModalOpen(true)
                                                    }}
                                                    className="inline-flex items-center gap-1 border border-secondary text-secondary hover:bg-secondary/15 rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer"
                                                >
                                                    <HugeiconsIcon icon={EyeIcon} className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                    Details
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => {
                                                        populateForm(song)
                                                        setIsEditModalOpen(true)
                                                    }}
                                                    className="text-white/60 hover:text-secondary transition-colors cursor-pointer"
                                                    aria-label="Edit song"
                                                >
                                                    <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4" strokeWidth={2} />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        setActiveSong(song)
                                                        setIsDeleteConfirmOpen(true)
                                                    }}
                                                    className="text-white/60 hover:text-red-error transition-colors cursor-pointer"
                                                    aria-label="Delete song"
                                                >
                                                    <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-white/40 text-sm">
                                        No songs found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL DIALOGS (Custom premium glassmorphic overlays) */}
            {/* ========================================================================= */}

            {/* 1. Upload Song Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm"
                        onClick={() => setIsUploadModalOpen(false)}
                    />
                    {/* Modal Content */}
                    <div className="relative bg-dark-accent border border-light-whitetext/15 rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl z-10">
                        {/* Header */}
                        <div 
                            style={{
                                backgroundImage: "var(--modal-header-bg)"
                            }}
                            className="px-6 py-5 border-b border-light-whitetext/10 flex items-center justify-between"
                        >
                            <h3 className="font-['Space_Grotesk'] text-lg font-medium text-white">
                                Upload New Song
                            </h3>
                            <button 
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-white/40 hover:text-white text-lg font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-4">
                            {formError && (
                                <div className="p-3 bg-red-error/10 border border-red-error/20 text-red-error rounded-md text-xs">
                                    {formError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Song Title *</label>
                                    <input 
                                        type="text" 
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="e.g. Neon Horizon"
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Artist Name *</label>
                                    <input 
                                        type="text" 
                                        value={formArtist}
                                        onChange={(e) => setFormArtist(e.target.value)}
                                        placeholder="e.g. Retro Kid"
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Album</label>
                                    <input 
                                        type="text" 
                                        value={formAlbum}
                                        onChange={(e) => setFormAlbum(e.target.value)}
                                        placeholder="e.g. Single / Album name"
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Genre</label>
                                    <select 
                                        value={formGenre}
                                        onChange={(e) => setFormGenre(e.target.value)}
                                        className="bg-dark-accent border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    >
                                        {["POP", "Synthwave", "R&B", "Rock", "Hip-Hop", "Jazz", "Electronic"].map(g => (
                                            <option key={g} value={g} className="bg-dark-accent">{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Duration</label>
                                    <input 
                                        type="text" 
                                        value={formDuration}
                                        onChange={(e) => setFormDuration(e.target.value)}
                                        placeholder="e.g. 4:20"
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Released Date</label>
                                    <input 
                                        type="date" 
                                        value={formReleasedDate}
                                        onChange={(e) => setFormReleasedDate(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Publishing Status</label>
                                    <select 
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as Song["status"])}
                                        className="bg-dark-accent border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    >
                                        {["Published", "Under Review", "Scheduled", "Rejected", "Draft"].map(s => (
                                            <option key={s} value={s} className="bg-dark-accent">{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setFormIsMySong(!formIsMySong)}
                                    className={cn(
                                        "h-4.5 w-4.5 rounded border flex items-center justify-center transition-all cursor-pointer",
                                        formIsMySong
                                            ? "border-secondary bg-secondary text-button-text"
                                            : "border-light-whitetext/30 bg-transparent"
                                    )}
                                >
                                    {formIsMySong && <span className="text-[10px] font-bold">✓</span>}
                                </button>
                                <span className="text-xs text-white/70">Mark as "My Song"</span>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-light-whitetext/10">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 rounded-full border border-light-whitetext/10 text-white/70 hover:text-white hover:border-light-whitetext/25 text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-full bg-secondary text-button-text hover:bg-secondary/95 text-xs font-semibold cursor-pointer"
                                >
                                    Upload Track
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Edit Song Modal */}
            {isEditModalOpen && activeSong && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm"
                        onClick={() => setIsEditModalOpen(false)}
                    />
                    {/* Modal Content */}
                    <div className="relative bg-dark-accent border border-light-whitetext/15 rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl z-10">
                        {/* Header */}
                        <div 
                            style={{
                                backgroundImage: "var(--modal-header-bg)"
                            }}
                            className="px-6 py-5 border-b border-light-whitetext/10 flex items-center justify-between"
                        >
                            <h3 className="font-['Space_Grotesk'] text-lg font-medium text-white">
                                Edit Song Details
                            </h3>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-white/40 hover:text-white text-lg font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
                            {formError && (
                                <div className="p-3 bg-red-error/10 border border-red-error/20 text-red-error rounded-md text-xs">
                                    {formError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Song Title *</label>
                                    <input 
                                        type="text" 
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Artist Name *</label>
                                    <input 
                                        type="text" 
                                        value={formArtist}
                                        onChange={(e) => setFormArtist(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Album</label>
                                    <input 
                                        type="text" 
                                        value={formAlbum}
                                        onChange={(e) => setFormAlbum(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Genre</label>
                                    <select 
                                        value={formGenre}
                                        onChange={(e) => setFormGenre(e.target.value)}
                                        className="bg-dark-accent border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    >
                                        {["POP", "Synthwave", "R&B", "Rock", "Hip-Hop", "Jazz", "Electronic"].map(g => (
                                            <option key={g} value={g} className="bg-dark-accent">{g}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Duration</label>
                                    <input 
                                        type="text" 
                                        value={formDuration}
                                        onChange={(e) => setFormDuration(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Released Date</label>
                                    <input 
                                        type="date" 
                                        value={formReleasedDate}
                                        onChange={(e) => setFormReleasedDate(e.target.value)}
                                        className="bg-search-bg/80 border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-white/60 text-xs font-semibold uppercase">Publishing Status</label>
                                    <select 
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as Song["status"])}
                                        className="bg-dark-accent border border-light-whitetext/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/40"
                                    >
                                        {["Published", "Under Review", "Scheduled", "Rejected", "Draft"].map(s => (
                                            <option key={s} value={s} className="bg-dark-accent">{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setFormIsMySong(!formIsMySong)}
                                    className={cn(
                                        "h-4.5 w-4.5 rounded border flex items-center justify-center transition-all cursor-pointer",
                                        formIsMySong
                                            ? "border-secondary bg-secondary text-button-text"
                                            : "border-light-whitetext/30 bg-transparent"
                                    )}
                                >
                                    {formIsMySong && <span className="text-[10px] font-bold">✓</span>}
                                </button>
                                <span className="text-xs text-white/70">Mark as "My Song"</span>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-light-whitetext/10">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 rounded-full border border-light-whitetext/10 text-white/70 hover:text-white hover:border-light-whitetext/25 text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-full bg-secondary text-button-text hover:bg-secondary/95 text-xs font-semibold cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Song Details Modal */}
            {isDetailsModalOpen && activeSong && activeSong.status === "Published" ? (
                <MusicDetails
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    song={activeSong}
                    onDelete={(id) => {
                        setIsDetailsModalOpen(false)
                        setIsDeleteConfirmOpen(true)
                    }}
                    onSave={(id, updatedData) => {
                        editSong(id, updatedData)
                        setActiveSong((prev) => prev ? { ...prev, ...updatedData } : null)
                    }}
                />
            ) : isDetailsModalOpen && activeSong ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm"
                        onClick={() => setIsDetailsModalOpen(false)}
                    />
                    {/* Modal Content */}
                    <div className="relative bg-dark-accent border border-light-whitetext/15 rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl z-10">
                        {/* Header */}
                        <div 
                            style={{
                                backgroundImage: "var(--modal-header-bg)"
                            }}
                            className="px-6 py-5 border-b border-light-whitetext/10 flex items-center justify-between"
                        >
                            <h3 className="font-['Space_Grotesk'] text-lg font-medium text-white">
                                Track Information
                            </h3>
                            <button 
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-white/40 hover:text-white text-lg font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Details Content */}
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-xl bg-secondary/10 border border-light-whitetext/10 overflow-hidden shrink-0">
                                    {activeSong.coverUrl ? (
                                        <img 
                                            src={activeSong.coverUrl} 
                                            alt={activeSong.title} 
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-secondary">
                                            <HugeiconsIcon icon={MusicNote01Icon} className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h4 className="text-white font-semibold text-lg truncate leading-tight font-['Space_Grotesk']">
                                        {activeSong.title}
                                    </h4>
                                    <p className="text-white/60 text-sm mt-1 truncate">
                                        by {activeSong.artist || "Unknown Artist"}
                                    </p>
                                    <span className={cn(
                                        "inline-block w-fit px-2.5 py-0.5 rounded-md text-[10px] font-medium border mt-2",
                                        activeSong.status === "Published" && "bg-green-success/10 text-green-success border-green-success/20",
                                        activeSong.status === "Draft" && "bg-white/5 text-white/40 border-light-whitetext/10",
                                        activeSong.status === "Scheduled" && "bg-yelow-warning/10 text-yelow-warning border-yelow-warning/20",
                                        activeSong.status === "Under Review" && "bg-primary/10 text-primary border-primary/20",
                                        activeSong.status === "Rejected" && "bg-red-error/10 text-red-error border-red-error/20"
                                    )}>
                                        {activeSong.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-b border-light-whitetext/10 py-4 my-2 text-sm">
                                <div>
                                    <span className="text-white/45 text-xs block uppercase font-medium">Album</span>
                                    <span className="text-white font-medium mt-0.5 block">{activeSong.album}</span>
                                </div>
                                <div>
                                    <span className="text-white/45 text-xs block uppercase font-medium">Genre</span>
                                    <span className="text-white font-medium mt-0.5 block">{activeSong.genre}</span>
                                </div>
                                <div>
                                    <span className="text-white/45 text-xs block uppercase font-medium">Duration</span>
                                    <span className="text-white font-medium mt-0.5 block">{activeSong.duration}</span>
                                </div>
                                <div>
                                    <span className="text-white/45 text-xs block uppercase font-medium">Released Date</span>
                                    <span className="text-white font-medium mt-0.5 block">{activeSong.releasedDate || "-"}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-white/45 text-xs block uppercase font-medium">Total Streams</span>
                                    <span className="text-secondary font-semibold mt-0.5 block text-lg font-['Space_Grotesk']">
                                        {activeSong.streams.toLocaleString()} streams
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-white/45 text-xs uppercase font-medium">Internal Song Code:</span>
                                <span className="text-white/70 text-xs font-mono bg-search-bg px-2 py-1 rounded border border-light-whitetext/5">
                                    TRK-{activeSong.id.toUpperCase()}
                                </span>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end mt-2 pt-4 border-t border-light-whitetext/10">
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="px-6 py-2 rounded-full bg-secondary text-button-text hover:bg-secondary/95 text-xs font-semibold cursor-pointer"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* 4. Delete Confirmation Modal */}
            {isDeleteConfirmOpen && activeSong && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm"
                        onClick={() => setIsDeleteConfirmOpen(false)}
                    />
                    {/* Modal Content */}
                    <div className="relative bg-dark-accent border border-light-whitetext/15 rounded-[24px] max-w-sm w-full overflow-hidden shadow-2xl z-10">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-light-whitetext/10 flex items-center justify-between">
                            <h3 className="font-['Space_Grotesk'] text-lg font-medium text-white">
                                Delete Track
                            </h3>
                            <button 
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="text-white/40 hover:text-white text-lg font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col gap-4">
                            <p className="text-white/70 text-sm leading-relaxed">
                                Are you sure you want to delete <span className="text-white font-semibold">"{activeSong.title}"</span>? This action cannot be undone.
                            </p>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-light-whitetext/10">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="px-4 py-2 rounded-full border border-light-whitetext/10 text-white/70 hover:text-white hover:border-light-whitetext/25 text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-5 py-2 rounded-full bg-red-error text-white hover:bg-red-error/90 text-xs font-semibold cursor-pointer"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}