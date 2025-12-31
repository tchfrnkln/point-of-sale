"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { useUserStore } from "@/store/user.store"
import { LogoutButton } from "./LogOut"
import { Button } from "@/components/ui/button"

export const UserInfo = ({ name }: { name: string }) => {
  const router = useRouter()
  const { fetchSession, session } = useUserStore()

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  if (!session) return null

  return (
    <>
      {/* HEADER */}
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{name}</h1>

        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">
            Hello {session.username} 
          </span>
          <LogoutButton />
        </div>
      </div>

      {/* FLOATING BACK BUTTON */}
      {session.role == "ADMIN" && <Button
        onClick={() => router.back()}
        size="icon"
        variant="secondary"
        className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg hover:scale-105 transition"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>}
    </>
  )
}
