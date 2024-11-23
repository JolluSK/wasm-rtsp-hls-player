"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import RTSPVideoPlayer from './RTSPVideoPlayer'
import HLSVideoPlayer from './HLSVideoPlayer'

const RtspView: React.FC = () => {
  const [rtspUrl, setRtspUrl] = useState('')
  const [currentStream, setCurrentStream] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamHistory, setStreamHistory] = useState<string[]>([])
  const [useHLS, setUseHLS] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem('streamHistory')
    if (savedHistory) {
      setStreamHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveStreamToHistory = (url: string) => {
    const updatedHistory = [url, ...streamHistory.filter(item => item !== url)].slice(0, 5)
    setStreamHistory(updatedHistory)
    localStorage.setItem('streamHistory', JSON.stringify(updatedHistory))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startStream(rtspUrl)
  }

  const startStream = (url: string) => {
    if (!url) {
      setError('Please enter a valid URL')
      return
    }
    setError('')
    setIsLoading(true)
    setConnectionStatus('connecting')
    
    setTimeout(() => {
      if (url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://')) {
        setCurrentStream(url)
        saveStreamToHistory(url)
        setConnectionStatus('connected')
      } else {
        setError('Invalid URL format. Please enter a valid RTSP or HLS URL.')
        setConnectionStatus('disconnected')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleHistoryItemClick = (url: string) => {
    setRtspUrl(url)
    startStream(url)
  }

  const handleRemoveHistoryItem = (url: string) => {
    const updatedHistory = streamHistory.filter(item => item !== url)
    setStreamHistory(updatedHistory)
    localStorage.setItem('streamHistory', JSON.stringify(updatedHistory))
    if (currentStream === url) {
      stopStream()
    }
  }

  const stopStream = () => {
    setCurrentStream('')
    setRtspUrl('')
    setConnectionStatus('disconnected')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stream Input</CardTitle>
          <CardDescription>Enter the RTSP or HLS URL to start streaming</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="rtsp://example.com/stream or http://example.com/stream.m3u8"
              value={rtspUrl}
              onChange={(e) => setRtspUrl(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="use-hls"
                checked={useHLS}
                onCheckedChange={setUseHLS}
              />
              <Label htmlFor="use-hls">Use HLS Player</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Start Streaming'}
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {streamHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Streams</h3>
              <ul className="space-y-2">
                {streamHistory.map((url, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <button
                      className="text-sm text-blue-500 hover:underline truncate max-w-[200px]"
                      onClick={() => handleHistoryItemClick(url)}
                    >
                      {url}
                    </button>
                    <div className="flex items-center space-x-2">
                      {currentStream === url && (
                        <span className="text-xs text-green-500">Active</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHistoryItem(url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Video Stream</CardTitle>
          <CardDescription>
            {currentStream ? (
              <div className="flex items-center justify-between">
                <span className="truncate">{currentStream}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500/20 text-green-500' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {connectionStatus}
                </span>
              </div>
            ) : (
              'No active stream'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-muted text-muted-foreground rounded-md">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : currentStream ? (
            useHLS ? (
              <HLSVideoPlayer url={currentStream} ref={videoRef} />
            ) : (
              <RTSPVideoPlayer url={currentStream} ref={videoRef} />
            )
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted text-muted-foreground rounded-md">
              No active stream
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RtspView

