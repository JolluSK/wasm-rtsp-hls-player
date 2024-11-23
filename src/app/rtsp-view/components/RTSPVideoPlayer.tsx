"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from 'lucide-react'
import { getFFmpeg } from '../lib/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface RTSPVideoPlayerProps {
  url: string
}

const RTSPVideoPlayer: React.FC<RTSPVideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null)

  useEffect(() => {
    const initializeFFmpeg = async () => {
      try {
        setIsLoading(true);
        const ffmpegInstance = await getFFmpeg();
        setFFmpeg(ffmpegInstance);

        ffmpegInstance.on('log', ({ message }) => {
          console.log('FFmpeg Log:', message);
        });

        setIsLoading(false);
        await startStreaming(ffmpegInstance);
      } catch (error) {
        console.error('FFmpeg initialization error:', error);
        setError(`Failed to initialize FFmpeg: ${(error as Error).message}`);
        setIsLoading(false);
      }
    };

    initializeFFmpeg();
  }, [url]);

  const startStreaming = async (ffmpegInstance: FFmpeg) => {
    if (!videoRef.current) return;

    try {
      // Write the RTSP stream to a virtual input file
      await ffmpegInstance.writeFile('input.sdp', await fetchFile(url));

      // Transcode the input to MP4
      await ffmpegInstance.exec([
        '-i', 'input.sdp',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-f', 'mp4',
        '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
        'output.mp4'
      ]);

      // Read the output file
      const data = await ffmpegInstance.readFile('output.mp4');

      // Create a Blob from the output data
      const blob = new Blob([data], { type: 'video/mp4' });

      // Create a URL for the Blob
      const videoURL = URL.createObjectURL(blob);

      // Set the video source to the Blob URL
      if (videoRef.current) {
        videoRef.current.src = videoURL;
      }
    } catch (error) {
      setError(`Streaming error: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted text-muted-foreground rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Initializing FFmpeg...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full aspect-video bg-black rounded-md max-h-[calc(100vh-20rem)]"
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default RTSPVideoPlayer;

