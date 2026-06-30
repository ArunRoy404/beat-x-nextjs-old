"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    MusicNote01Icon,
    Calendar03Icon,
    HeadphonesIcon,
    Clock01Icon,
    CheckmarkCircle01Icon,
    Delete01Icon,
    PencilEdit01Icon,
    Upload01Icon,
    EyeIcon
} from "@hugeicons/core-free-icons"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"
import { Song } from "@/dummyData/musicData"
import { cn } from "@/lib/utils"

interface MusicDetailsProps {
    isOpen: boolean
    onClose: () => void
    song: Song | null
    onDelete: (id: string) => void
    onSave: (id: string, updatedData: Partial<Song>) => void
}

export default function MusicDetails({
    isOpen,
    onClose,
    song,
    onDelete,
    onSave
}: MusicDetailsProps) {
    const [activeTab, setActiveTab] = useState<"Details" | "Analytics" | "Edit">("Details")

    // Form inputs for edit
    const [formTitle, setFormTitle] = useState("")
    const [formArtist, setFormArtist] = useState("")
    const [formAlbum, setFormAlbum] = useState("")
    const [formGenre, setFormGenre] = useState("POP")
    const [formDuration, setFormDuration] = useState("3:42")
    const [formReleasedDate, setFormReleasedDate] = useState("")
    const [formStatus, setFormStatus] = useState<Song["status"]>("Published")
    const [formIsMySong, setFormIsMySong] = useState(false)
    const [explicit, setExplicit] = useState(false)

    // Populate inputs when song is opened
    useEffect(() => {
        if (song) {
            setFormTitle(song.title)
            setFormArtist(song.artist || "")
            setFormAlbum(song.album)
            setFormGenre(song.genre)
            setFormDuration(song.duration)
            setFormReleasedDate(song.releasedDate || "")
            setFormStatus(song.status)
            setFormIsMySong(song.isMySong)
            setExplicit(song.streams > 3000000)
            setActiveTab("Details")
        }
    }, [song, isOpen])

    if (!isOpen || !song) return null

    // Formatter for streams
    const formatStreams = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M"
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K"
        }
        return num.toString()
    }

    const formattedStreams = formatStreams(song.streams)

    // Dummy Analytics Data
    const chartData = [
        { name: "Wk 1", streams: 10 },
        { name: "Wk 2", streams: 20 },
        { name: "Wk 3", streams: 18 },
        { name: "Wk 4", streams: 20 },
        { name: "Wk 5", streams: 32 },
        { name: "Wk 6", streams: 30 },
        { name: "Wk 7", streams: 45 }
    ]

    // Form submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(song.id, {
            title: formTitle,
            artist: formArtist,
            album: formAlbum,
            genre: formGenre,
            duration: formDuration,
            releasedDate: formReleasedDate,
            status: formStatus,
            isMySong: formIsMySong
        })
        setActiveTab("Details")
    }

    // Analytics Card background style with white/20 overlay and 8px rounding
    const analyticsCardStyle = {
        background: "linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), var(--card-bg-style)",
        borderRadius: "8px"
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-overlay-backdrop/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-background border border-light-whitetext/15 rounded-[16px] max-w-2xl w-full overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
                
                {/* 1. Shared Figma-styled Header */}
                <div 
                    style={{
                        backgroundImage: "var(--modal-header-bg)"
                    }}
                    className="p-6 border-b border-light-whitetext/10 flex items-center justify-between gap-4 shrink-0"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Cover Image */}
                        <div className="h-[74px] w-[74px] rounded-[16px] bg-secondary/10 border border-light-whitetext/10 overflow-hidden shrink-0">
                            {song.coverUrl ? (
                                <img 
                                    src={song.coverUrl} 
                                    alt={song.title} 
                                    className="h-full w-full object-cover" 
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-secondary">
                                    <HugeiconsIcon icon={MusicNote01Icon} className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        {/* Title, Badge & Subtitle */}
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-white font-bold text-lg font-['Space_Grotesk'] tracking-tight">
                                    {song.title}
                                </h2>
                                {/* Yellow Checkmark badge */}
                                <span className="inline-flex items-center justify-center bg-[#FFAE00] text-black rounded-full w-4 h-4 shrink-0">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                {/* Published status Badge */}
                                <span className="bg-green-success/15 border border-green-success/30 text-green-success text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0">
                                    • {song.status}
                                </span>
                            </div>
                            
                            {/* Subtitle (Artist · Album) */}
                            <p className="text-light-gray text-xs mt-1 font-medium">
                                {song.artist || "Unknown Artist"} · {song.album}
                            </p>

                            {/* Stats inline separated by line */}
                            <div className="flex items-center gap-3 mt-2 text-xs">
                                <span className="text-white font-semibold">{formattedStreams}</span>
                                <span className="text-light-whitetext">Plays</span>
                                <span className="h-3 w-px bg-light-whitetext/15" />
                                <span className="text-white font-semibold">{song.duration}</span>
                                <span className="text-light-whitetext">Duration</span>
                            </div>
                        </div>
                    </div>

                    {/* Close (X) button */}
                    <button 
                        onClick={onClose}
                        className="text-white/40 hover:text-white border border-light-whitetext/10 hover:border-light-whitetext/25 h-10 w-10 flex items-center justify-center rounded-full transition-colors cursor-pointer shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* 2. Tabs Selector (Full Width) */}
                <div className="border-b border-light-whitetext/10 bg-background flex w-full shrink-0">
                    {(["Details", "Analytics", "Edit"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-4 text-sm font-semibold tracking-wide border-b-2 transition-all relative cursor-pointer text-center",
                                activeTab === tab
                                    ? "text-secondary border-secondary font-bold"
                                    : "text-light-gray border-transparent hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-background/50">
                    
                    {/* TAB A: DETAILS */}
                    {activeTab === "Details" && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Artist */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Artist</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.artist || "Unknown Artist"}</span>
                                </div>
                                {/* Album */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Album</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.album}</span>
                                </div>
                                {/* Genre */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Genre</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.genre}</span>
                                </div>
                                {/* Duration */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Duration</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.duration}</span>
                                </div>
                                {/* Released Date */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Release Date</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.releasedDate || "2024-02-15"}</span>
                                </div>
                                {/* Total Streams */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Total Streams</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{song.streams.toLocaleString()}</span>
                                </div>
                                {/* Format */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Format</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">MP3 · 320kbps</span>
                                </div>
                                {/* Explicit */}
                                <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1">
                                    <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Explicit</span>
                                    <span className="text-white text-[14px] font-semibold font-['Space_Grotesk']">{explicit ? "Yes" : "No"}</span>
                                </div>
                            </div>

                            {/* Description (Full Width) */}
                            <div className="border border-light-whitetext/10 bg-dark-accent/10 rounded-[16px] p-4 flex flex-col gap-1 mt-2 col-span-2">
                                <span className="text-dark-gray text-[12px] font-semibold uppercase tracking-wider">Description</span>
                                <p className="text-white text-[14px] font-semibold leading-relaxed">
                                    "{song.title}" is a {song.genre} track by {song.artist || "Tahsin Ahmed"} from the album {song.album}. It has accumulated {formattedStreams} streams since release.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB B: ANALYTICS */}
                    {activeTab === "Analytics" && (
                        <div className="flex flex-col gap-6">
                            
                            {/* Stat cards row using public/bg-images/card_bg.png with white/20 overlay and 8px rounding */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Total Plays */}
                                <div 
                                    style={analyticsCardStyle}
                                    className="border border-light-whitetext/10 rounded-[8px] p-4 flex flex-col justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-2xl font-['Space_Grotesk']">{formattedStreams}</span>
                                            <span className="text-light-gray text-[10px] font-semibold uppercase tracking-wider mt-0.5">Total Plays</span>
                                        </div>
                                        <div className="bg-secondary/15 text-secondary border border-secondary/35 h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                                            <HugeiconsIcon icon={HeadphonesIcon} className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 border-t border-light-whitetext/5 pt-2">
                                        <span className="text-white/30 text-[10px] font-medium">VS Last Month</span>
                                        <span className="text-red-error text-[10px] font-bold bg-red-error/10 border border-red-error/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                            ↘ -8%
                                        </span>
                                    </div>
                                </div>

                                {/* Avg. Daily */}
                                <div 
                                    style={analyticsCardStyle}
                                    className="border border-light-whitetext/10 rounded-[8px] p-4 flex flex-col justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-2xl font-['Space_Grotesk']">1.8K</span>
                                            <span className="text-light-gray text-[10px] font-semibold uppercase tracking-wider mt-0.5">Avg. Daily</span>
                                        </div>
                                        <div className="bg-primary/15 text-primary border border-primary/35 h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 border-t border-light-whitetext/5 pt-2">
                                        <span className="text-white/30 text-[10px] font-medium">VS Last Month</span>
                                        <span className="text-red-error text-[10px] font-bold bg-red-error/10 border border-red-error/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                            ↘ -8%
                                        </span>
                                    </div>
                                </div>

                                {/* Engagement */}
                                <div 
                                    style={analyticsCardStyle}
                                    className="border border-light-whitetext/10 rounded-[8px] p-4 flex flex-col justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-2xl font-['Space_Grotesk']">{formattedStreams}</span>
                                            <span className="text-light-gray text-[10px] font-semibold uppercase tracking-wider mt-0.5">Engagement</span>
                                        </div>
                                        <div className="bg-green-success/15 text-green-success border border-green-success/35 h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 border-t border-light-whitetext/5 pt-2">
                                        <span className="text-white/30 text-[10px] font-medium">VS Last Month</span>
                                        <span className="text-red-error text-[10px] font-bold bg-red-error/10 border border-red-error/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                            ↘ -8%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Container using card_bg.png with white/20 overlay and 8px rounding */}
                            <div 
                                style={analyticsCardStyle}
                                className="border border-light-whitetext/10 rounded-[8px] p-5 flex flex-col gap-4"
                            >
                                <h3 className="text-white font-semibold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
                                    Performance Over Time
                                </h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="rgba(255,255,255,0.3)" 
                                                fontSize={11} 
                                                tickLine={false} 
                                                axisLine={false} 
                                            />
                                            <YAxis 
                                                stroke="rgba(255,255,255,0.3)" 
                                                fontSize={11} 
                                                tickLine={false} 
                                                axisLine={false}
                                                domain={[0, 80]}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: "var(--background)", 
                                                    borderColor: "rgba(255,255,255,0.1)",
                                                    color: "#fff",
                                                    borderRadius: "8px",
                                                    fontSize: "12px"
                                                }} 
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="streams" 
                                                stroke="var(--secondary)" 
                                                strokeWidth={2}
                                                fillOpacity={1} 
                                                fill="url(#colorStreams)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Lower analytics breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* By Platform */}
                                <div 
                                    style={analyticsCardStyle}
                                    className="border border-light-whitetext/10 rounded-[8px] p-5 flex flex-col gap-4"
                                >
                                    <h3 className="text-white font-semibold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
                                        By Platform
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {/* iOS */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-xs font-medium">
                                                <span className="text-light-gray">iOS</span>
                                                <span className="text-white">48%</span>
                                            </div>
                                            <div className="w-full bg-light-whitetext/5 h-2 rounded-full overflow-hidden">
                                                <div className="bg-secondary h-full rounded-full w-[48%]" />
                                            </div>
                                        </div>
                                        {/* Android */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-xs font-medium">
                                                <span className="text-light-gray">Android</span>
                                                <span className="text-white">39%</span>
                                            </div>
                                            <div className="w-full bg-light-whitetext/5 h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full w-[39%]" />
                                            </div>
                                        </div>
                                        {/* Web */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-xs font-medium">
                                                <span className="text-light-gray">Web</span>
                                                <span className="text-white">13%</span>
                                            </div>
                                            <div className="w-full bg-light-whitetext/5 h-2 rounded-full overflow-hidden">
                                                <div className="bg-green-success h-full rounded-full w-[13%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Countries using flag emoji */}
                                <div 
                                    style={analyticsCardStyle}
                                    className="border border-light-whitetext/10 rounded-[8px] p-5 flex flex-col gap-4"
                                >
                                    <h3 className="text-white font-semibold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
                                        Top Countries
                                    </h3>
                                    <div className="flex flex-col gap-3 text-sm">
                                        <div className="flex justify-between items-center py-1">
                                            <span className="flex items-center gap-2 text-light-gray font-medium">
                                                <span>🇧🇩</span> Bangladesh
                                            </span>
                                            <span className="text-white font-semibold">71%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-t border-light-whitetext/5">
                                            <span className="flex items-center gap-2 text-light-gray font-medium">
                                                <span>🇮🇳</span> India
                                            </span>
                                            <span className="text-white font-semibold">15%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-t border-light-whitetext/5">
                                            <span className="flex items-center gap-2 text-light-gray font-medium">
                                                <span>🌐</span> Others
                                            </span>
                                            <span className="text-white font-semibold">6%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB C: EDIT */}
                    {activeTab === "Edit" && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Dropzones */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Audio Dropzone */}
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-secondary/20 hover:border-secondary/40 bg-dark-accent/15 rounded-[16px] cursor-pointer transition-all gap-2 text-center group">
                                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-105 transition-transform">
                                        <HugeiconsIcon icon={Upload01Icon} className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-white">Drop your audio file here</span>
                                    <span className="text-[10px] text-light-gray">MP3, WAV, FLAC - Max 200MB</span>
                                </div>
                                
                                {/* Cover Art Dropzone */}
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/20 hover:border-primary/40 bg-dark-accent/15 rounded-[16px] cursor-pointer transition-all gap-2 text-center group">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                                        <HugeiconsIcon icon={MusicNote01Icon} className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-white">Upload cover art</span>
                                    <span className="text-[10px] text-light-gray">min 1000×1000px</span>
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="flex flex-col gap-4">
                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-primary text-[16px] font-semibold uppercase">Song Title</label>
                                    <input 
                                        type="text" 
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Enter song title..."
                                        className="bg-search-bg border border-light-whitetext/10 rounded-[16px] px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-secondary/40 transition-colors"
                                    />
                                </div>

                                {/* Artist & Album */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-primary text-[16px] font-semibold uppercase">Artist</label>
                                        <input 
                                            type="text" 
                                            value={formArtist}
                                            onChange={(e) => setFormArtist(e.target.value)}
                                            placeholder="Artist Name"
                                            className="bg-search-bg border border-light-whitetext/10 rounded-[16px] px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-secondary/40 transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-primary text-[16px] font-semibold uppercase">Album</label>
                                        <input 
                                            type="text" 
                                            value={formAlbum}
                                            onChange={(e) => setFormAlbum(e.target.value)}
                                            placeholder="Album name (optional)"
                                            className="bg-search-bg border border-light-whitetext/10 rounded-[16px] px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-secondary/40 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Genre & Release Date */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-primary text-[16px] font-semibold uppercase">Genre</label>
                                        <select 
                                            value={formGenre}
                                            onChange={(e) => setFormGenre(e.target.value)}
                                            className="bg-dark-accent border border-light-whitetext/10 rounded-[16px] px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary/40 transition-colors"
                                        >
                                            {["POP", "Synthwave", "R&B", "Rock", "Hip-Hop", "Jazz", "Electronic"].map(g => (
                                                <option key={g} value={g} className="bg-dark-accent">{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-primary text-[16px] font-semibold uppercase">Release Date</label>
                                        <input 
                                            type="date" 
                                            value={formReleasedDate}
                                            onChange={(e) => setFormReleasedDate(e.target.value)}
                                            className="bg-search-bg border border-light-whitetext/10 rounded-[16px] px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary/40 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Visibility Selector */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-primary text-[16px] font-semibold uppercase">Visibility</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormStatus("Published")}
                                            className={cn(
                                                "py-3 px-4 rounded-[16px] border flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all",
                                                formStatus === "Published"
                                                    ? "border-secondary/45 bg-secondary/10 text-secondary"
                                                    : "border-light-whitetext/10 bg-dark-accent/25 text-light-gray hover:text-white"
                                            )}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-success" />
                                            Publish Now
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormStatus("Scheduled")}
                                            className={cn(
                                                "py-3 px-4 rounded-[16px] border flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all",
                                                formStatus === "Scheduled"
                                                    ? "border-secondary/45 bg-secondary/10 text-secondary"
                                                    : "border-light-whitetext/10 bg-dark-accent/25 text-light-gray hover:text-white"
                                            )}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-yelow-warning" />
                                            Schedule
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormStatus("Draft")}
                                            className={cn(
                                                "py-3 px-4 rounded-[16px] border flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all",
                                                formStatus === "Draft"
                                                    ? "border-secondary/45 bg-secondary/10 text-secondary"
                                                    : "border-light-whitetext/10 bg-dark-accent/25 text-light-gray hover:text-white"
                                            )}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                            Save as Draft
                                        </button>
                                    </div>
                                </div>

                                {/* Explicit Switch */}
                                <div className="flex items-center justify-between py-2 border-t border-light-whitetext/5 mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-semibold">Explicit Content</span>
                                        <span className="text-light-gray text-[10px]">Mark this track as explicit if it contains strong language</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setExplicit(!explicit)}
                                        className={cn(
                                            "w-11 h-6 rounded-full relative transition-colors cursor-pointer",
                                            explicit ? "bg-secondary" : "bg-light-whitetext/10"
                                        )}
                                    >
                                        <span 
                                            className={cn(
                                                "h-5 w-5 rounded-full bg-black absolute top-0.5 left-0.5 transition-transform",
                                                explicit ? "translate-x-5" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Inner Form Actions with Gradient Button */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-light-whitetext/5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("Details")}
                                    className="px-6 py-2.5 rounded-full border border-light-whitetext/10 text-light-gray hover:text-white text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: "var(--button-bg)",
                                        color: "var(--button-text)"
                                    }}
                                    className="px-6 py-2.5 rounded-full font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                </div>

                {/* 4. Global Action Footer styled with var(--mdal-footer-bg) */}
                <div 
                    style={{
                        backgroundColor: "var(--mdal-footer-bg)"
                    }}
                    className="p-4 border-t border-light-whitetext/10 flex items-center justify-between shrink-0"
                >
                    <button
                        onClick={() => onDelete(song.id)}
                        className="flex items-center gap-1.5 text-red-error hover:bg-red-error/15 border border-red-error/20 bg-red-error/5 hover:border-red-error/30 rounded-[16px] px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
                    >
                        <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-[16px] bg-light-whitetext/5 border border-light-whitetext/10 hover:bg-light-whitetext/10 text-white hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    )
}
