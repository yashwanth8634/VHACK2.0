import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy-load below-fold sections — reduces initial JS bundle significantly
const Domains = dynamic(() => import("@/components/Domains"), { ssr: true });
const PrizePool = dynamic(() => import("@/components/PrizePool"), {
  ssr: true,
});
const WhyParticipate = dynamic(() => import("@/components/WhyParticipate"), {
  ssr: true,
});
const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: true });
const CollegeMap = dynamic(() => import("@/components/CollegeMap"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <main className="relative">
      <ScrollToTop />
      <Navbar />
      <Hero />

      {/* Marquee Banner */}
      <div className="relative overflow-hidden py-6 sm:py-8 border-y border-white/5 bg-white/[0.01]">
        <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                24H HACKATHON
              </span>
              <span className="text-primary text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                ₹50K PRIZES
              </span>
              <span className="text-secondary text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                3 DOMAINS
              </span>
              <span className="text-accent text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                FEB 27-28
              </span>
              <span className="text-primary text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                TEAM SIZE: 3
              </span>
              <span className="text-secondary text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                VITS HYDERABAD
              </span>
              <span className="text-accent text-xl">✦</span>

              <span className="text-base sm:text-lg md:text-xl font-[Gilroy-Bold] text-gray-400 tracking-widest uppercase">
                BUILD · INNOVATE · WIN
              </span>
              <span className="text-primary text-xl">✦</span>
            </div>
          ))}
        </div>
      </div>

      <Domains />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <PrizePool />

      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <WhyParticipate />

      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <Timeline />
      <CollegeMap />
      <Footer />
    </main>
  );
}
