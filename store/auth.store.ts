import { error } from "console"
import { toast } from "sonner"
import { create } from "zustand"

type AuthStore = {
  username: string
  password: string
  repassword: string
  adminKey: string
  setUsername: (v: string) => void
  setPassword: (v: string) => void
  setRePassword: (v: string) => void
  setAdminKey: (v: string) => void
  login: () => Promise<void>
  signup: () => Promise<void>
  recover: () => Promise<void>
  error: string | null
  loading: boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  username: "",
  password: "",
  repassword: "",
  adminKey:"",
  error: null,
  loading: false,

  setUsername: (v) => set({ username: v }),
  setPassword: (v) => set({ password: v }),
  setRePassword: (v:string) => set({ repassword: v }),
  setAdminKey: (v:string) => set({ adminKey: v }),

  login: async () => {
    const { username, password } = get()

    if (!username || !password){
      toast.error("Username and password are required.")
      return set({ error: "Username and password are required." })
    }else{
      set({ error: null })
    }

    return console.log(username, password);
    

    set({ loading: true, error: null })

    try {
      // Call your Next.js API route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        set({ error: data.message, loading: false })
        return
      }

      console.log("Logged in:", data)
      set({ loading: false, username: "", password: "" })
      // You can store a token or session here
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  signup: async () => {
    const { username, password, repassword, adminKey } = get()

    const fetchAdminkey = "" //function here

    if (!username || !password || !repassword){
      toast.error("Username and password are required.")
      return set({ error: "Username and password are required." })
    }else if(password !== repassword){
      toast.error("Passwords do not match.")
      return set({ error: "Passwords do not match." })
    }else if(adminKey !== fetchAdminkey){
      toast.error("Admin key does not match")
      return set({ error: "Admin key does not match" })
    }else{
      set({ error: null })
    }

    return console.log(username, password);
    

    set({ loading: true, error: null })

    try {
      // Call your Next.js API route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        set({ error: data.message, loading: false })
        return
      }

      console.log("Logged in:", data)
      set({ loading: false, username: "", password: "" })
      // You can store a token or session here
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  recover: async () => {
    const { username, password, adminKey } = get()

    const fetchAdminkey = "" //function here

    if (!username || !password || !adminKey){
      toast.error("Username, password and AdminKey are required.")
      return set({ error: "Username, password and AdminKey are required." })
    }else if(adminKey !== fetchAdminkey){
      toast.error("Admin key does not match")
      return set({ error: "Admin key does not match" })
    }else{
      set({ error: null })
    }

    return console.log(username, password);
    

    set({ loading: true, error: null })

    try {
      // Call your Next.js API route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        set({ error: data.message, loading: false })
        return
      }

      console.log("Logged in:", data)
      set({ loading: false, username: "", password: "" })
      // You can store a token or session here
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  
}))
