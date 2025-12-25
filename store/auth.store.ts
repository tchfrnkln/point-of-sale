import { login, signUp } from "@/lib/auth/auth"
// import { error } from "console"
import { toast } from "sonner"
import { create } from "zustand"

type AuthStore = {
  email:string
  username: string
  password: string
  repassword: string
  setEmail: (v: string) => void
  setUsername: (v: string) => void
  setPassword: (v: string) => void
  setRePassword: (v: string) => void
  login: () => Promise<void>
  signup: () => Promise<void>
  recover: () => Promise<void>
  error: string | null
  loading: boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  email: "",
  username: "",
  password: "",
  repassword: "",
  adminKey:"",
  error: null,
  loading: false,

  setEmail: (v) => set({ email: v }),
  setUsername: (v) => set({ username: v }),
  setPassword: (v) => set({ password: v }),
  setRePassword: (v) => set({ repassword: v }),

  login: async () => {
    const { username, password } = get()

    if (!username || !password){
      toast.error("Username and password are required.")
      return set({ error: "Username and password are required." })
    }else{
      set({ error: null })
    }

    set({ loading: true, error: null })
   
    try {
      await login({ username, password });
      set({ loading: false, username: "", password: ""})
      toast.success("Login Successful!")
    }catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : String(err)
      // console.log("Error from code", err.message);
      toast.error("Login failed, Try Again")
      set({ error: errorMessage, loading: false })
    }
  },

  signup: async () => {
    const { email, username, password } = get()

    if (!username || !password || !email){
      toast.error("All Fields are required.")
      return set({ error: "All Fields are required" })
    }else{
      set({ error: null })
    }    

    set({ loading: true, error: null })

    try {
      await signUp({ email, username, password });
      set({ loading: false, email: "", username: "", password: ""})
      toast.success("Signup successful!")
    }catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : String(err)
      // console.log("Error from code", err.message);
      
      toast.error("Signup failed, Try Again with a Different Email")
      set({ error: errorMessage, loading: false })
    }

  },

  recover: async () => {
    const { username, password } = get()

    if (!username || !password ){
      toast.error("All Fields are required.")
      return set({ error: "All Fields are required." })
    }else{
      set({ error: null })
    }

    return console.log(username, password);
    

    set({ loading: true, error: null })

  },
  
}))
