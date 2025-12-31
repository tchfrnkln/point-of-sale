"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
// import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";
import { useEffect } from "react";

export function LogoutButton() {
  const router = useRouter();
  const logout = useUserStore(state => state.logout);
  const fetchSession = useUserStore(state => state.fetchSession)
  const session = useUserStore(state => state.session)

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  if (!session) return null

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace("/auth");
    } catch {
      toast.error("Failed to logout");
    }
  }

  return (
    <Dialog>
        
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button variant="destructive" onClick={handleLogout}>
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
