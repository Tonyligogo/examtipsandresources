import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles, Building2 } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import { useAllDocuments } from "@/hooks/useDocuments";
import { useInstitutions } from "@/hooks/useInstitutions";

// ── Infinite scroll ticker ─────────────────────────────────────────────────────
const InstitutionsTicker = ({ institutions }: { institutions: { id: string; title: string }[] }) => {
  // Duplicate list enough times to fill wide screens seamlessly
  const repeated = [...institutions, ...institutions, ...institutions];

  return (
    <div className="relative mt-12 overflow-hidden">
      {/* Section label */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="h-px flex-1 bg-linear-to-r from-transparent to-orange-200" />
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8651A]/70">
          <Building2 className="h-3.5 w-3.5" />
          Partner Institutions
        </div>
        <div className="h-px flex-1 bg-linear-to-l from-transparent to-orange-200" />
      </div>

      {/* Left + right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-orange-50/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-orange-50/60 to-transparent" />

      {/* Scrolling track */}
      <div className="flex w-full overflow-hidden py-4">
        <div
          className="flex shrink-0 items-center gap-6 animate-marquee"
          style={{ animationDuration: `${Math.max(institutions.length * 4, 20)}s` }}
        >
          {repeated.map((inst, idx) => (
            <div
              key={`${inst.id}-${idx}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-orange-100 bg-white px-5 py-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8651A]/10">
                <Building2 className="h-3.5 w-3.5 text-[#E8651A]" />
              </div>
              <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                {inst.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// ── Featured Section ───────────────────────────────────────────────────────────
const FeaturedSection = () => {
  const { data: documents = [], isPending } = useAllDocuments();
  const { data: institutions = [] } = useInstitutions();
  console.log(institutions)

  const featuredDocs = documents
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <section className="px-6 lg:px-16 py-12 lg:py-20 bg-orange-50/60">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#E8651A]" />
              <span className="text-sm font-semibold text-[#E8651A]">Fresh Resources</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Featured Study Materials
            </h2>
            <p className="mt-1.5 text-gray-500">
              Recently added nursing resources — handpicked for your exams
            </p>
          </div>

          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E8651A] px-4 py-2 text-sm font-semibold text-[#E8651A] transition-all hover:bg-[#E8651A] hover:text-white"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Cards */}
        {isPending ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : featuredDocs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
            <p className="text-base font-medium">No resources available yet</p>
            <p className="mt-1 text-sm">Check back soon!</p>
          </div>
        )}

        {/* Mobile view-all */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8651A] px-5 py-2 text-sm font-semibold text-[#E8651A] transition-all hover:bg-[#E8651A] hover:text-white"
          >
            View all resources <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Institutions ticker — only shown when there are institutions */}
        {institutions.length > 0 && (
          <InstitutionsTicker institutions={institutions} />
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;