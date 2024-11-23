"use client"

import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface VideoPlayerProps {
  url: string
}

const HLSVideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError('Failed to load the video stream. Please check the URL and try again.')
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.addEventListener('error', () => {
        setError('Failed to load the video stream. Please check the URL and try again.')
      })
    } else {
      setError('Your browser does not support HLS playback.')
    }

    return () => {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.destroy()
      }
    }
  }, [url])

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
    <video ref={videoRef} controls className="w-full aspect-video bg-black rounded-md">
      Your browser does not support the video tag.
    </video>
  )
}

export default HLSVideoPlayer

