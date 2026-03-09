import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Stethoscope } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Millie Brown",
    role: "3rd Year Nursing Student, Chamberlain University",
    quote:
      "The pharmacology notes here are incredibly well-structured. I went from barely passing to topping my class after using these revision materials consistently for just two months.",
    rating: 5,
    image: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: 2,
    name: "Zack Johnson",
    role: "Registered Nurse, Passed NCLEX in 2023",
    quote:
      "I used this platform to prepare for my licensing exams. The clinical guides and past papers gave me exactly the confidence I needed. I passed on my first attempt.",
    rating: 5,
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 3,
    name: "Amber Lee",
    role: "Final Year Student, University of Pennsylvania",
    quote:
      "Anatomy and Medical-Surgical were my weakest subjects. The notes on this platform are so clear and exam-focused. I finally feel ready to graduate with confidence.",
    rating: 5,
    image: "https://i.pravatar.cc/300?img=32",
  },
];

const avatars = [
  "https://i.pravatar.cc/60?img=47",
  "https://i.pravatar.cc/60?img=12",
  "https://i.pravatar.cc/60?img=32",
];

const AUTOPLAY_INTERVAL = 5000;

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 350);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, "right");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, "left");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="w-full py-12 px-4 lg:px-16 bg-white">
      {/* Section eyebrow */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-[#E8651A]" />
          <span className="text-sm font-semibold text-[#E8651A]">Student Stories</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Hear From Our Students
        </h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Real results from nursing students who studied smarter with our materials.
        </p>
      </div>

      {/* Card */}
      <div
        className="relative mx-auto rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #c45210 0%, #E8651A 45%, #f07830 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-white/5" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col md:flex-row items-stretch md:min-h-95">

          {/* ── Left content ── */}
          <div className="flex-1 p-6 sm:p-10 md:p-14 flex flex-col justify-between">

            {/* Quote block */}
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${direction === "right" ? "-20px" : "20px"})`
                  : "translateX(0)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              {/* Big quote mark */}
              <div className="text-white/30 font-black mb-2 leading-none select-none text-6xl sm:text-8xl">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5"
                    fill={i < t.rating ? "white" : "transparent"}
                    stroke={i < t.rating ? "white" : "rgba(255,255,255,0.4)"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
                {t.quote}
              </p>

              {/* Name + role */}
              <div className="mb-5 sm:mb-8">
                <p className="text-white font-bold text-base">{t.name}</p>
                <p className="text-white/60 text-sm mt-0.5">{t.role}</p>
              </div>
            </div>

            {/* Mobile prev/next — only visible when image panel is hidden */}
            <div className="flex gap-2 mb-4 md:hidden">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/30 bg-white/10 text-white transition-all hover:bg-white/25 focus:outline-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-[#E8651A] transition-all hover:bg-orange-50 focus:outline-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Avatar stack + dots */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Clickable avatars */}
              <div className="flex -space-x-2">
                {avatars.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? "right" : "left")}
                    className="relative focus:outline-none"
                    title={testimonials[i].name}
                  >
                    <img
                      src={src}
                      alt={testimonials[i].name}
                      className="w-10 h-10 rounded-full object-cover border-2 transition-all duration-300"
                      style={{
                        borderColor: i === current ? "white" : "rgba(255,255,255,0.3)",
                        transform: i === current ? "scale(1.18)" : "scale(1)",
                        zIndex: i === current ? 10 : 1,
                      }}
                    />
                  </button>
                ))}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border-2 border-white/20 text-[10px] font-bold text-white ml-1">
                  2k+
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? "right" : "left")}
                    className="rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      width: i === current ? "28px" : "8px",
                      height: "8px",
                      background: i === current ? "white" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: photo ── */}
          <div className="relative hidden md:flex shrink-0 items-end justify-center md:w-72 lg:w-80 md:px-0">
            {/* Arch */}
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 w-56 md:w-64"
              style={{
                height: "88%",
                background: "rgba(255,255,255,0.10)",
                borderRadius: "160px 160px 0 0",
              }}
            />

            {/* Photo */}
            <div
              className="relative z-10"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? "scale(0.96)" : "scale(1)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <img
                src={t.image}
                alt={t.name}
                className="object-cover object-top rounded-t-full"
                style={{ width: "220px", height: "280px", display: "block" }}
              />
            </div>

            {/* Prev / Next */}
            <div className="absolute bottom-6 right-4 flex gap-2 z-20">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/30 bg-white/10 text-white transition-all hover:bg-white/25 focus:outline-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-[#E8651A] transition-all hover:bg-orange-50 focus:outline-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}