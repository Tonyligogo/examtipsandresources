import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch{
      toast.error("Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join StudyVault today</p>
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
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-secondary font-medium text-secondary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {isLoading ? "Creating…" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
