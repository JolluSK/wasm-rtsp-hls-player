"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Maximize2, Minimize2, PictureInPicture2, Play, Pause, Square, Volume2, VolumeX } from 'lucide-react'

interface VideoControlsProps {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  progress: number
  duration: number
  currentTime: number
  isFullscreen: boolean
  quality: string
  onPlayPause: () => void
  onMute: () => void
  onVolumeChange: (value: number[]) => void
  onSeek: (value: number[]) => void
  onFullscreen: () => void
  onPictureInPicture: () => void
  onSnapshot: () => void
  onQualityChange: (value: string) => void
  onStop: () => void
}

export function VideoControls({
  isPlaying,
  isMuted,
  volume,
  progress,
  duration,
  currentTime,
  isFullscreen,
  quality,
  onPlayPause,
  onMute,
  onVolumeChange,
  onSeek,
  onFullscreen,
  onPictureInPicture,
  onSnapshot,
  onQualityChange,
  onStop
}: VideoControlsProps) {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="flex flex-col gap-2">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={onSeek}
          className="cursor-pointer"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPlayPause} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onStop} className="text-white hover:bg-white/20">
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
              className="w-24"
            />
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={quality} onValueChange={onQualityChange}>
              <SelectTrigger className="w-[100px] bg-transparent border-white/20 text-white">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={onSnapshot} className="text-white hover:bg-white/20">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onPictureInPicture} className="text-white hover:bg-white/20">
              <PictureInPicture2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onFullscreen} className="text-white hover:bg-white/20">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

