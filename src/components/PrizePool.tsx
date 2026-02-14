"use client";

import { motion, useInView } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react";

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const prizes = [
  {
    icon: "🏆",
    title: "Cash Prizes",
    description:
      "Win from a total prize pool for top-performing teams across all domains.",
    color: "amber",
  },
  {
    icon: "💼",
    title: "Internship & Jobs",
    description:
      "Exclusive internship and job opportunities for top-performing participants.",
    color: "cyan",
  },
  {
    icon: "👕",
    title: "Goodies & Swags",
    description:
      "Exclusive t-shirts, sticker packs, and limited edition hackathon gear.",
    color: "purple",
  },
  {
    icon: "🎖️",
    title: "Consolation Prizes",
    description:
      "Special recognition and rewards for standout projects and creative solutions.",
    color: "green",
  },
];

function PrizeCard({
  prize,
  index,
  inView,
}: {
  prize: (typeof prizes)[0];
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onMouseMove={handleMouseMove}
      className="glass-card p-6 sm:p-6 text-center group relative overflow-hidden cursor-default"
      style={{
        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
      }}
    >
      <div className="text-4xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300">
        {prize.icon}
      </div>
      <h4 className="text-lg sm:text-lg font-[Gilroy-Bold] text-white mb-2 sm:mb-2">
        {prize.title}
      </h4>
      <p className="text-sm sm:text-sm text-gray-400 font-[Gilroy-Light] leading-relaxed">
        {prize.description}
      </p>
    </motion.div>
  );
}

export default function PrizePool() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const mainCardRef = useRef<HTMLDivElement>(null);

  const handleMainMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!mainCardRef.current) return;
      const rect = mainCardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainCardRef.current.style.setProperty("--mouse-x", `${x}%`);
      mainCardRef.current.style.setProperty("--mouse-y", `${y}%`);
    },
    [],
  );

  return (
    <section id="prizes" className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245, 158, 11, 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-xs font-[Gilroy-Bold] tracking-widest text-accent uppercase mb-4 sm:mb-6">
             What You Win
          </span>
          <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
            PRIZE POOL
          </h2>
        </motion.div>

        {/* Main Prize */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-3xl rounded-full" />
            <div
              ref={mainCardRef}
              onMouseMove={handleMainMouseMove}
              className="relative glass-card !rounded-3xl px-10 py-10 sm:px-20 sm:py-14 border-amber-500/20 hover:border-amber-500/40 cursor-default"
              style={{
                background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,158,11,0.08), rgba(255,255,255,0.02))`,
              }}
            >
              <p className="text-base sm:text-lg font-[Gilroy-Bold] text-amber-400/80 mb-2 tracking-widest uppercase">
                Total Prize Pool
              </p>
              <h3 className="text-5xl sm:text-7xl md:text-8xl font-[Gilroy-Heavy] text-white mb-2 sm:mb-3">
                ₹<AnimatedCounter target={50000} />
              </h3>
              <p className="text-gray-400 font-[Gilroy-Medium] text-sm sm:text-base">
                + Internships, Goodies & More
              </p>
            </div>
          </div>
        </motion.div>

        {/* Prize cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {prizes.map((prize, i) => (
            <PrizeCard
              key={prize.title}
              prize={prize}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* Extra note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-amber-500/20 bg-amber-500/[0.05]">
            <span className="text-[10px] sm:text-sm font-[Gilroy-Bold] text-amber-300/80 tracking-wide">
              AND MANY MORE EXCITING REWARDS!
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
