import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star, Users, Award } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "20+", label: "Study Guides" },
  { icon: Users, value: "100+", label: "Nursing Students" },
  { icon: Star, value: "4.9", label: "Avg. Rating" },
  { icon: Award, value: "98%", label: "Pass Rate" },
];

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#E8651A]">

      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-125 w-125 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

      {/* Subtle dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative px-6 lg:px-16 py-20">
        <div className="mx-auto max-w-4xl">

          {/* Main CTA content */}
          <div className="mb-14 text-center">
            {/* Pill label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              Trusted by nursing students across the world
            </div>

            <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Ready to Ace Your
              <br />
              <span className="text-white/80">Nursing Exams?</span>
            </h2>

            <p className="mx-auto mb-8 max-w-md text-lg text-white/75 leading-relaxed">
              Join thousands of nursing students studying smarter with expert-curated notes, past papers, and clinical guides.
            </p>

            {/* CTAs */}
            <div className="">
              <Link
                to="/catalog"
                className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#E8651A] shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Browse Materials <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-5 text-center border border-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-white">{value}</span>
                <span className="text-xs font-medium text-white/65">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;