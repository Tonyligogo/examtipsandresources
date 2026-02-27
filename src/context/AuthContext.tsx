import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client";

interface AppUser {
  id: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function buildAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id)
    .maybeSingle();

  if (error) {
    console.error("Role fetch failed:", error);
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    role: data?.role === "admin" ? "admin" : "user",
  };
}

async function handleSession(session: Session | null): Promise<AppUser | null> {
  if (!session?.user) return null;
  return await buildAppUser(session.user);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session,
    // so we don't need a separate getSession() call at all.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsLoading(true);
        const appUser = await handleSession(session);
        setUser(appUser);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Don't touch isLoading here — let onAuthStateChange handle it.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // onAuthStateChange will fire with null session and set user to null
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};