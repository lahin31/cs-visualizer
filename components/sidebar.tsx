"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Code, 
  Database, 
  FileText, 
  Menu, 
  X, 
  Home,
  ChevronRight,
  Settings,
  BarChart3,
  Network
} from "lucide-react"

const navigationItems = [
  {
    title: "AST Visualizer",
    href: "/",
    icon: Code,
    description: "Parse and visualize code ASTs"
  },
  {
    title: "Python Compilation",
    href: "/compilation",
    icon: FileText,
    description: "Python compilation process"
  },
   {
    title: "Database Architecture",
    href: "/database",
    icon: Database,
    description: "SQL database architecture"
  },
  {
    title: "TCP Protocol",
    href: "/tcp",
    icon: Network,
    description: "TCP protocol visualization"
  },
  {
    title: "UDP Protocol",
    href: "/udp",
    icon: Network,
    description: "UDP protocol visualization"
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-50 ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsCollapsed(true)} />
      )}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CS Visualizer</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile menu button */}
      {isCollapsed && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="bg-background"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

                   {/* Navigation */}
             <div className="p-4 space-y-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
                                   <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md mb-2 ${
                       isActive
                         ? "bg-primary/10 border-primary/20"
                         : "hover:bg-muted/50"
                     }`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
