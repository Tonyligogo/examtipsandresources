import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
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
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function buildAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  // Check role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id);

  const isAdmin = roles?.some((r: unknown) => (r as { role: string }).role === "admin") ?? false;

  // Get profile
  await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", supabaseUser.id)
    .single();

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    role: isAdmin ? "admin" : "user",
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const appUser = await buildAppUser(session.user);
          setUser(appUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
