import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, FileText, DollarSign, Eye, Trash2, Plus, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MockDoc {
  id: string;
  title: string;
  sales: number;
  revenue: number;
  status: "published" | "draft";
}

const initialDocs: MockDoc[] = [
  { id: "d1", title: "Complete Data Structures & Algorithms Guide", sales: 234, revenue: 3039.66, status: "published" },
  { id: "d2", title: "Algorithm Design: Advanced Techniques", sales: 278, revenue: 4444.22, status: "published" },
  { id: "d3", title: "Machine Learning Fundamentals", sales: 0, revenue: 0, status: "draft" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<MockDoc[]>(initialDocs);
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Sign in required</h2>
            <p className="mt-2 text-muted-foreground">You need to sign in to access the dashboard.</p>
            <Link to="/login" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-6 font-medium text-secondary-foreground">
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalSales = docs.reduce((s, d) => s + d.sales, 0);
  const totalRevenue = docs.reduce((s, d) => s + d.revenue, 0);

  const handleUpload = () => {
    if (!newTitle.trim()) return;
    setDocs((prev) => [
      ...prev,
      { id: `d-${Date.now()}`, title: newTitle, sales: 0, revenue: 0, status: "draft" },
    ]);
    setNewTitle("");
    setShowUpload(false);
    toast.success("Document added as draft!");
  };

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document removed.");
  };

  const handlePublish = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "published" } : d)));
    toast.success("Document published!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileText, label: "Documents", value: docs.length.toString() },
            { icon: BarChart3, label: "Total Sales", value: totalSales.toString() },
            { icon: DollarSign, label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" /> {label}
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Upload modal */}
        {showUpload && (
          <div className="mb-6 rounded-xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">Upload New Document</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Document title"
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
              />
              <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Click to upload PDF or DOCX (prototype)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  className="h-10 rounded-xl bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-all hover:brightness-110"
                >
                  Add Document
                </button>
                <button
                  onClick={() => setShowUpload(false)}
                  className="h-10 rounded-xl border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document list */}
        <div className="rounded-xl border bg-card shadow-card">
          <div className="border-b px-5 py-3">
            <h3 className="font-medium text-foreground">Your Documents</h3>
          </div>
          <div className="divide-y">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.sales} sales · ${d.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      d.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.status}
                  </span>
                  {d.status === "draft" && (
                    <button
                      onClick={() => handlePublish(d.id)}
                      className="flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <Eye className="h-3 w-3" /> Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          📦 This is a prototype dashboard — no real files are uploaded or stored.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
