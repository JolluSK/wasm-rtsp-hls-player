import React, { forwardRef, useEffect } from 'react'
import Hls from 'hls.js'

interface HLSVideoPlayerProps {
  url: string
}

const HLSVideoPlayer = forwardRef<HTMLVideoElement, HLSVideoPlayerProps>(({ url }, ref) => {
  useEffect(() => {
    if (Hls.isSupported() && ref && 'current' in ref && ref.current) {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(ref.current)
    }
  }, [url, ref])

  return (
    <video
      ref={ref}
      controls
      autoPlay
      className="w-full aspect-video bg-black rounded-md"
    >
      Your browser does not support the video tag.
    </video>
  )
})

HLSVideoPlayer.displayName = 'HLSVideoPlayer'

export default HLSVideoPlayer

