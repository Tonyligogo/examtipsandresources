import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("password");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    toast.success("Welcome back!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your StudyVault account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary font-medium text-secondary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <strong>Demo accounts:</strong><br />
          student@demo.com / seller@demo.com (any password)
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-secondary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
