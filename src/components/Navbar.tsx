import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut, User} from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="px-6 lg:px-16 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-md md:text-xl font-bold text-foreground">EXAM TIPS & RESOURCES</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/catalog"
            className="text-sm font-medium hidden md:block"
          >
            Browse
          </Link>
          <CartDrawer />
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/dashboard" className="items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex">
                  <LayoutDashboard className="h-3.5 w-3.5" /> <span className="hidden md:block">Dashboard</span> 
                </Link>
              )}
                <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted" title="Sign out">
                  <LogOut className="h-4 w-4 text-foreground" />
                </button>
            </>
          ) : (
            <Link to="/login" className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <User className="h-3.5 w-3.5" /> <span className="hidden md:block">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
