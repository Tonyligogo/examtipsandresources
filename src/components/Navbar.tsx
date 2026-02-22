import { Link } from "react-router-dom";
import { BookOpen} from "lucide-react";
import CartDrawer from "./CartDrawer";

const Navbar = () => {

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
