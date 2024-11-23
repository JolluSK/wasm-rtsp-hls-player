"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2, Maximize2, Minimize2, Play, Square } from 'lucide-react'
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
    const [isFullscreen, setIsFullscreen] = useState(false)

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
        // Simulate URL validation (replace with actual validation logic)
        setTimeout(() => {
            if (url.startsWith('rtsp://') || url.startsWith('http://') || url.startsWith('https://')) {
                setCurrentStream(url)
                saveStreamToHistory(url)
                setIsLoading(false)
            } else {
                setError('Invalid URL format. Please enter a valid RTSP or HLS URL.')
                setIsLoading(false)
            }
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
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    return (
        <div className={`grid gap-6 ${isFullscreen ? '' : 'md:grid-cols-2'}`}>
            {!isFullscreen && (
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
                            <div className="flex space-x-2">
                                <Button type="submit" className="flex-1" disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Start Streaming'}
                                </Button>
                                <Button type="button" variant="outline" onClick={stopStream} disabled={!currentStream}>
                                    <Square className="h-4 w-4" />
                                </Button>
                            </div>
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
            )}
            <Card className={isFullscreen ? 'fixed inset-0 z-50' : ''}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Video Stream</CardTitle>
                        <CardDescription>
                            {currentStream ? `Current stream: ${currentStream}` : 'No active stream'}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 bg-muted text-muted-foreground rounded-md">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : currentStream ? (
                        useHLS ? (
                            <HLSVideoPlayer url={currentStream} />
                        ) : (
                            <RTSPVideoPlayer url={currentStream} />
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

