"use client"
import { useUserStore } from "@/store/user.store";
import { useEffect } from "react";
import { LogoutButton } from "./LogOut";

export const UserInfo = ({name}:{name:string}) => {

    const { fetchSession, session } = useUserStore()
    
      useEffect(() => {
        fetchSession()
      }, [fetchSession])
    
      if (!session) return null
  return (
    <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="w-max px-6 flex justify-between items-center">
            <div className="px-6">Hello {session.username}</div>
            <LogoutButton/>
        </div>
    </div>
  )
}
