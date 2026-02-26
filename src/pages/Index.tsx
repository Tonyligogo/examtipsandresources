import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import { supabase } from "@/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import type { Document } from "@/lib/data";

const Index = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error(error);
        setDocs([]);
      } else {
        setDocs(data ?? []);
      }

      setLoading(false);
    };

    fetchDocs();
  }, []);

  const featuredDocs = docs.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute h-svh">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 to-primary" />
        </div>

        <div className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
              Study Smarter, Not Harder
            </h1>
            <p className="px-4 mb-8 text-lg text-primary-foreground/90">
              Access high-quality study materials crafted by top educators.
              Preview before you buy, download instantly after purchase.
            </p>

            <Link
              to="/catalog"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-secondary px-8 font-medium text-secondary-foreground shadow-hero transition-all hover:brightness-110"
            >
              Browse Materials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container grid grid-cols-3 divide-x py-8">
          <div className="flex flex-col items-center gap-1 px-4">
            <FileText className="mb-1 h-5 w-5" />
            <span className="font-display text-2xl font-bold text-foreground">
              {docs.length}+
            </span>
            <span className="text-xs text-muted-foreground">Documents</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <Users className="mb-1 h-5 w-5" />
            <span className="font-display text-2xl font-bold text-foreground">
              2,500+
            </span>
            <span className="text-xs text-muted-foreground">Students</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <Shield className="mb-1 h-5 w-5" />
            <span className="font-display text-2xl font-bold text-foreground">
              Verified
            </span>
            <span className="text-xs text-muted-foreground">Authors</span>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 lg:px-16 py-6 lg:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Featured Materials
            </h2>
            <p className="mt-1 text-muted-foreground">
              Recently added study resources
            </p>
          </div>

          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium sm:flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading materials…
          </div>
        ) : featuredDocs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No documents available yet
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            Ready to ace your exams?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-primary-foreground/80">
            Join thousands of students who are already studying smarter.
          </p>

          <Link
            to="/catalog"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-secondary px-8 font-medium text-secondary-foreground shadow-hero transition-all hover:brightness-110"
          >
            Browse Materials <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;