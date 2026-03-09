import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Search, Stethoscope} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Sub-components ---

interface StatBadgeProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
}

const StatBadge = ({ icon, value, label, className = "" }: StatBadgeProps) => (
  <div
    className={`flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg min-w-[140px] ${className}`}
  >
    <div className="text-[#E8651A] shrink-0">{icon}</div>
    <div>
      <div className="text-lg font-extrabold text-[#E8651A] leading-tight">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </div>
  </div>
);

interface FeatureItemProps {
  icon: React.ReactNode;
  label: string;
}

const FeatureItem = ({ icon, label }: FeatureItemProps) => (
  <div className="flex items-center gap-2.5">
    <div className="text-gray-600">{icon}</div>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </div>
);

// --- Main Hero Component ---
export default function HeroSection() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/catalog?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/catalog");
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <section className="relative min-h-[calc(100vh-70px)] flex items-center overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/nurse-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Mobile: light white wash so text stays readable */}
        <div className="absolute inset-0 pointer-events-none bg-white/70 sm:bg-transparent" />

        {/* Desktop: orange-left gradient */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(232,101,26,0.35) 0%, rgba(255,225,195,0.80) 20%, rgba(255,244,235,0.96) 40%, transparent 65%)",
          }}
        />

        {/* Desktop: warm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            background:
              "radial-gradient(ellipse 45% 70% at 0% 55%, rgba(232,101,26,0.10) 0%, transparent 65%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full sm:max-w-[620px] px-6 py-16 sm:px-10 lg:pl-20">

          <Badge
            variant="secondary"
            className="mb-5 text-xs font-semibold tracking-wide text-gray-500 bg-gray-100 border-0"
          >
            #1 Nursing Study Platform
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-gray-900 tracking-tight mb-5">
            Ace Your Nursing
            <br />
            <span className="text-[#E8651A]">Exams &amp; Beyond</span>
          </h1>

          <p className="text-base text-gray-500 leading-relaxed mb-9 max-w-[460px]">
            Trusted revision notes, past papers, and clinical guides — everything nursing students need to pass exams and become confident practitioners.
          </p>

          {/* Search bar — stacked on mobile, pill on desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-md px-4 sm:px-6 py-3 sm:py-1.5 max-w-[500px] mb-10 gap-2">
            <Input
              type="text"
              placeholder='e.g. "Pharmacology", "Anatomy", "NCLEX"'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm text-gray-700 bg-transparent px-0"
            />
            <Button
              className="rounded-xl sm:rounded-full bg-[#E8651A] hover:bg-[#D15A14] text-white text-sm font-bold px-6 gap-2 w-full sm:w-auto"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
              Search resources
            </Button>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <FeatureItem icon={<GraduationCap className="h-5 w-5" />} label="Study Anywhere" />
            <div className="w-px h-7 bg-gray-300" />
            <FeatureItem icon={<Stethoscope className="h-5 w-5" />} label="Exam-Ready Content" />
          </div>
        </div>

        {/* Stat badges — desktop: floating top/bottom right */}
        <StatBadge
          icon={<BookOpen className="h-5 w-5" />}
          value="20+"
          label="Study Guides"
          className="hidden sm:flex absolute top-8 right-8 z-20"
        />
        <StatBadge
          icon={<GraduationCap className="h-5 w-5" />}
          value="100+"
          label="Nursing Students"
          className="hidden sm:flex absolute bottom-8 right-8 z-20"
        />

        {/* Stat badges — mobile: pinned to bottom of section */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3 sm:hidden z-20">
          <StatBadge
            icon={<BookOpen className="h-5 w-5" />}
            value="500+"
            label="Study Guides"
            className="flex-1"
          />
          <StatBadge
            icon={<GraduationCap className="h-5 w-5" />}
            value="2,000+"
            label="Nursing Students"
            className="flex-1"
          />
        </div>
      </section>
    </div>
  );
}