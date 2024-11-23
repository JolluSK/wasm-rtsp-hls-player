"use client"

import RtspView from '@/app/rtsp-view/components/RtspView'
import Layout from '@/app/components/layout/Layout'

export default function RtspViewPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'RTSP View', href: '/rtsp-view' },
  ]

  return (
    <Layout breadcrumbItems={breadcrumbItems}>
      <h1 className="text-2xl font-semibold text-foreground mb-4">RTSP View</h1>
      <RtspView />
    </Layout>
  )
}

