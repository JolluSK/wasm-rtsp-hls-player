"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Camera, BarChart2, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Camera, label: 'RTSP View', href: '/rtsp-view' },
    { icon: BarChart2, label: 'Analytics', href: '/analytics' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-14" : "w-56"
    )}>
      <div className="flex h-full flex-col">
        <nav className="flex-grow py-2">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start h-9",
                    pathname === item.href && "bg-muted",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2 text-sm">{item.label}</span>}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 mx-auto mb-4"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar

