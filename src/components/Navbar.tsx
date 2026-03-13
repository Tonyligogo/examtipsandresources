import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

/* Reusable NavLink styling */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold pb-1 border-b-2 transition ${
    isActive
      ? "text-orange-500 border-orange-500"
      : "text-gray-700 border-transparent hover:text-orange-500"
  }`;

export default function Navbar() {
  const [user, setUser] = useState<Session|null>(null);
  const navigate = useNavigate();
    useEffect(()=>{
        const getSession = async () =>{
            const { data:{session} } = await supabase.auth.getSession();
            setUser(session);
        }
        getSession();
      },[]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Failed to signout')
      } else {
        setUser(null);
        navigate('/');
      }
  }

  return (
    <nav className="sticky top-0 z-50 h-17.5 border-b border-gray-100 bg-white">
      <div className="flex h-full items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-display text-lg font-extrabold tracking-tight text-gray-900">
            Exam Tips & Resources
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex flex-1 items-center gap-8 pl-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/catalog" className={navLinkClass}>
            Resources
          </NavLink>

          <NavLink to="/packages" className={navLinkClass}>
            Packages
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <CartDrawer />

          {/* Auth */}
          {user ? (
            <>
              {user && (
                <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-100 transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
              )}

              <button
                onClick={handleLogout}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:bg-gray-100 transition"
              >
                <LogOut className="h-4 w-4 text-gray-700" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-100 transition"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:block">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}