"use client"

import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'

interface LayoutProps {
  children: React.ReactNode
  breadcrumbItems: { label: string; href: string }[]
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbItems }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-grow p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

