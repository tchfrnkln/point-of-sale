import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type UserSession = {
  userId: string;
  email: string;
  role: string;
  username: string;
};

type UserStore = {
  session: UserSession | null;
  setSession: (session: UserSession | null) => void;
  fetchSession: () => Promise<void>;
  logout: (router?: AppRouterInstance) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  session: null,

  setSession: (session) => set({ session }),

  fetchSession: async () => {
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    if (authError || !authData.session) {
      set({ session: null });
      return;
    }

    const user = authData.session.user;

    // 🔥 FETCH FROM PROFILES TABLE
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Failed to fetch profile:", profileError?.message);
      set({ session: null });
      return;
    }

    set({
      session: {
        userId: user.id,
        email: user.email ?? "",
        username: profile.username,
        role: profile.role
      }
    });
  },

  logout: async (router) => {
    await supabase.auth.signOut();
    set({ session: null });
    router?.replace("/auth");
  }
}));
