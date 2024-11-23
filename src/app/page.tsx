"use client"

import Layout from '@/app/components/layout/Layout'

export default function Home() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
  ]

  return (
    <Layout breadcrumbItems={breadcrumbItems}>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Welcome to JSMUI</h1>
      <p className="text-gray-600 dark:text-gray-300">This is the home page of your application. </p>
    </Layout>
  )
}
