// hooks/useRouteGuard.ts
"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/store/user.store"

export function useRouteGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const { session } = useUserStore()

  useEffect(() => {
    if (!session) return

    // STAFF restrictions
    if (
      session.role !== "ADMIN" &&
      pathname.startsWith("/dashboard") &&
      pathname !== "/dashboard/pos"
    ) {
      router.replace("/dashboard/pos")
    }
  }, [session, pathname, router])
}
