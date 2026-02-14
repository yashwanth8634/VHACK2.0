"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useCallback, MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";

const domains: {
  track: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  gradient: string;
  glowColor: string;
  tags: string[];
}[] = [
  {
    track: "01",
    title: "Agentic AI & Intelligent Automation",
    description:
      "Build autonomous agents, LLM orchestration systems, and intelligent automation pipelines that push the boundaries of what AI can do independently.",
    shortDescription: "Build autonomous agents & AI systems.",
    icon: "🤖",
    gradient: "from-cyan-500 to-blue-600",
    glowColor: "rgba(0, 212, 255, 0.15)",
    tags: ["LLM Agents", "RAG", "Autonomous Systems", "AI Workflows"],
  },
  {
    track: "02",
    title: "Cybersecurity & Fintech",
    description:
      "Innovate in secure infrastructure, threat detection, digital banking solutions, and next-gen financial technology that protects and empowers.",
    shortDescription: "Innovate in secure fintech & threat detection.",
    icon: "🔒",
    gradient: "from-purple-500 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.15)",
    tags: ["Threat Detection", "DeFi", "Zero Trust", "Digital Banking"],
  },
  {
    track: "03",
    title: "Blockchain / Web3 / IoT",
    description:
      "Create decentralized applications, smart contracts, connected device ecosystems, and Web3 experiences that redefine digital interaction.",
    shortDescription: "Build dApps & connected IoT ecosystems.",
    icon: "⛓️",
    gradient: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.15)",
    tags: ["Smart Contracts", "dApps", "IoT Networks", "Tokenization"],
  },
];

function DomainCard({
  domain,
  index,
}: {
  domain: (typeof domains)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="domain-card glass-card p-6 sm:p-8 group relative"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${domain.glowColor}, transparent 40%)`,
        }}
      />

      <div className="relative z-10">
        {/* Track number + icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xs font-[Gilroy-Bold] tracking-widest text-gray-500 uppercase">
                Track
              </span>
              <p
                className={`text-3xl font-[Gilroy-Heavy] bg-gradient-to-r ${domain.gradient} bg-clip-text text-transparent`}
              >
                {domain.track}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-[Gilroy-Bold] text-white mb-3 leading-tight">
          {domain.title}
        </h3>

        {/* Description */}
        <div className="text-gray-400 font-[Gilroy-Light] leading-relaxed mb-4 sm:mb-6">
          <p className="block sm:hidden text-sm">{domain.shortDescription}</p>
          <p className="hidden sm:block text-sm">{domain.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {domain.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 sm:px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs sm:text-xs font-[Gilroy-Medium] text-gray-400 hover:text-primary hover:border-primary/30 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r ${domain.gradient} text-white font-[Gilroy-Bold] text-sm sm:text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.05] active:scale-100 transition-all duration-300 group/btn`}
        >
          Choose Track
          <svg
            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Domains() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="domains" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="glow-top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold tracking-widest text-primary uppercase mb-6">
            Choose Your Arena
          </span>
          <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
            DOMAINS
          </h2>
          <p className="section-subtitle mx-auto text-sm sm:text-base">
            Pick your track and build something extraordinary.
          </p>
        </motion.div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {domains.map((domain, i) => (
            <DomainCard key={domain.track} domain={domain} index={i} />
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 text-sm text-gray-500"
        >
          * Selection of one domain is mandatory before registering.
        </motion.p>
      </div>
    </section>
  );
}
