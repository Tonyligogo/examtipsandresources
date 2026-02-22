import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import { documents } from "@/lib/data";
import heroBg from "@/assets/hero-bg.jpg";

const featuredDocs = documents.filter((d) => d.featured).slice(0, 4);

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute h-svh">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 to-primary" />
        </div>
        <div className=" relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-in-up">
              Study Smarter, Not Harder
            </h1>
            <p className="px-4 mb-8 text-lg text-primary-foreground/90 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Access high-quality study materials crafted by top educators.
              Preview before you buy, download instantly after purchase.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-secondary px-8 font-medium text-secondary-foreground shadow-hero transition-all hover:brightness-110"
              >
                Browse Materials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container grid grid-cols-3 divide-x py-8">
          {[
            { icon: FileText, label: "Documents", value: `${documents.length}0+` },
            { icon: Users, label: "Students", value: "2,500+" },
            { icon: Shield, label: "Verified Authors", value: "50+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-4">
              <Icon className="mb-1 h-5 w-5" />
              <span className="font-display text-2xl font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 lg:px-16 py-6 lg:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Materials</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked by our editorial team</p>
          </div>
          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium sm:flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to ace your exams?</h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-primary-foreground/80">
            Join thousands of students who are already studying smarter with our curated materials.
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
