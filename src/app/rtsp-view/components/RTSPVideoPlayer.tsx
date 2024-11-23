"use client"

import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from 'lucide-react'
import { getFFmpeg } from '../lib/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { VideoControls } from './VideoControls'

interface RTSPVideoPlayerProps {
  url: string
}

const RTSPVideoPlayer = forwardRef<HTMLVideoElement, RTSPVideoPlayerProps>(({ url }, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(videoRef.current)
      } else {
        ref.current = videoRef.current
      }
    }
  }, [ref])

  useEffect(() => {
    const initializeFFmpeg = async () => {
      try {
        setIsLoading(true)
        const ffmpegInstance = await getFFmpeg()
        setFFmpeg(ffmpegInstance)
        
        ffmpegInstance.on('log', ({ message }) => {
          console.log('FFmpeg Log:', message)
        })

        setIsLoading(false)
        await startStreaming(ffmpegInstance)
      } catch (error) {
        console.error('FFmpeg initialization error:', error)
        setError(`Failed to initialize FFmpeg: ${(error as Error).message}`)
        setIsLoading(false)
      }
    }

    initializeFFmpeg()

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [url])

  const startStreaming = async (ffmpegInstance: FFmpeg) => {
    if (!videoRef.current) return

    try {
      setIsBuffering(true)
      await ffmpegInstance.writeFile('input.sdp', await fetchFile(url))

      await ffmpegInstance.exec([
        '-i', 'input.sdp',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-f', 'mp4',
        '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
        'output.mp4'
      ])

      const data = await ffmpegInstance.readFile('output.mp4')
      const blob = new Blob([data], { type: 'video/mp4' })
      const videoURL = URL.createObjectURL(blob)

      if (videoRef.current) {
        videoRef.current.src = videoURL
        await videoRef.current.play()
        setIsPlaying(true)
        setIsBuffering(false)
      }
    } catch (error) {
      setError(`Streaming error: ${(error as Error).message}`)
      setIsBuffering(false)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * videoRef.current.duration
      videoRef.current.currentTime = time
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
    }
  }

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handlePictureInPicture = async () => {
    if (!document.pictureInPictureElement) {
      await videoRef.current?.requestPictureInPicture()
    } else {
      await document.exitPictureInPicture()
    }
  }

  const handleSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const link = document.createElement('a')
        link.download = `snapshot-${new Date().toISOString()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    }
  }

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted text-muted-foreground rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Initializing FFmpeg...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div ref={containerRef} className="relative group">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded-md"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      >
        Your browser does not support the video tag.
      </video>
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        volume={volume}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        isFullscreen={isFullscreen}
        quality={quality}
        onPlayPause={handlePlayPause}
        onMute={handleMute}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        onFullscreen={handleFullscreen}
        onPictureInPicture={handlePictureInPicture}
        onSnapshot={handleSnapshot}
        onQualityChange={setQuality}
        onStop={handleStop}
      />
    </div>
  )
})

RTSPVideoPlayer.displayName = 'RTSPVideoPlayer'

export default RTSPVideoPlayer

