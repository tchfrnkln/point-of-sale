// app/dashboard/layout.tsx
"use client"

import { useRouteGuard } from "@/lib/useRouteGuard"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRouteGuard()

  return <>{children}</>
}
