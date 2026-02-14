"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useCallback, MouseEvent as ReactMouseEvent } from "react";

const reasons: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}[] = [
  {
    icon: "🤝",
    title: "Collaborate",
    description:
      "Team up with brilliant minds and build together in a high-energy environment.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: "🎓",
    title: "Mentorship",
    description:
      "Get guidance from industry experts and experienced mentors throughout.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: "💼",
    title: "Recruitment",
    description:
      "Catch the eye of top companies. Your performance could land you your dream role.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: "🧠",
    title: "Learn & Grow",
    description:
      "Push your limits with cutting-edge tech stacks and real-world problem solving.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: "🏅",
    title: "Certificates",
    description:
      "All participants receive certificates. Stand out on your resume with hackathon experience.",
    gradient: "from-rose-500 to-red-600",
  },
  {
    icon: "🎉",
    title: "Unforgettable Fun",
    description:
      "Food, fun, networking, and 24 hours of building something incredible with your peers.",
    gradient: "from-indigo-500 to-violet-600",
  },
];

function ReasonCard({
  reason,
  index,
  inView,
}: {
  reason: (typeof reasons)[0];
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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onMouseMove={handleMouseMove}
      className="glass-card p-6 sm:p-8 group text-center relative overflow-hidden cursor-default"
      style={{
        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
      }}
    >
      {/* Hover gradient line at top */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="text-4xl sm:text-5xl mb-4 sm:mb-5 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
        {reason.icon}
      </div>
      <h3 className="text-lg sm:text-xl font-[Gilroy-Bold] text-white mb-2 sm:mb-3">
        {reason.title}
      </h3>
      <p className="text-sm sm:text-sm text-gray-400 font-[Gilroy-Light] leading-relaxed">
        {reason.description}
      </p>
    </motion.div>
  );
}

export default function WhyParticipate() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="glow-top-left" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-xs font-[Gilroy-Bold] tracking-widest text-primary uppercase mb-4 sm:mb-6">
            Why Join
          </span>
          <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
            WHY PARTICIPATE?
          </h2>
          <p className="section-subtitle mx-auto">
            More than just a hackathon — it&apos;s an experience that shapes
            your tech career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reasons.map((reason, i) => (
            <ReasonCard
              key={reason.title}
              reason={reason}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
