"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/upload": "Analyze resume",
  "/analysis": "Resume analysis",
  "/jobs": "Job matching",
  "/improve": "Improvements",
  "/history": "History",
  "/settings": "Settings",
}

export function AppHeader() {
  const pathname = usePathname()
  const title =
    Object.entries(TITLES).find(([href]) => pathname.startsWith(href))?.[1] ?? "ResumeIQ"

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <h1 className="text-sm font-medium">{title}</h1>
      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  )
}
