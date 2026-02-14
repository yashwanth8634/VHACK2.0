"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const day1Events: {
  time: string;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    time: "09:30 – 10:00 AM",
    title: "Opening Ceremony",
    desc: "Welcome and event kickoff",
    icon: "🎬",
  },
  {
    time: "10:00 – 10:30 AM",
    title: "Idea Presentation",
    desc: "Present ideas and form teams",
    icon: "💡",
  },
  {
    time: "10:30 AM – 12:30 PM",
    title: "Development Session 1",
    desc: "First coding and development phase",
    icon: "💻",
  },
  {
    time: "12:30 – 01:00 PM",
    title: "First Evaluation",
    desc: "Initial progress assessment",
    icon: "📋",
  },
  {
    time: "01:00 – 02:00 PM",
    title: "Lunch Break",
    desc: "Networking and food",
    icon: "🍽️",
  },
  {
    time: "02:00 – 04:00 PM",
    title: "Development Session 2",
    desc: "Second development phase",
    icon: "⚡",
  },
  {
    time: "04:00 – 05:00 PM",
    title: "Elimination Round",
    desc: "Second level assessment",
    icon: "🎯",
  },
  {
    time: "05:00 – 05:30 PM",
    title: "Snacks Break",
    desc: "Quick refreshments",
    icon: "☕",
  },
  {
    time: "05:30 – 08:00 PM",
    title: "Coding Phase 3 (P1)",
    desc: "Evening development sprint",
    icon: "🔥",
  },
  {
    time: "08:00 – 08:30 PM",
    title: "Dinner Time",
    desc: "Provided for all participants",
    icon: "🍕",
  },
  {
    time: "08:30 PM – 12:00 AM",
    title: "Coding Phase 3 (P2)",
    desc: "Late night marathon starts",
    icon: "🌙",
  },
];

const day2Events: {
  time: string;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    time: "12:00 AM – 06:00 AM",
    title: "Overnight Grind",
    desc: "Deep focus coding session",
    icon: "🌃",
  },
  {
    time: "06:00 – 07:00 AM",
    title: "Top 10 Selection",
    desc: "Picking the strongest projects",
    icon: "⭐",
  },
  {
    time: "07:00 – 07:30 AM",
    title: "Breakfast",
    desc: "Recharge for final pitches",
    icon: "🥐",
  },
  {
    time: "07:30 – 08:30 AM",
    title: "Final Presentations",
    desc: "Pitching to the judges",
    icon: "🎤",
  },
  {
    time: "08:30 – 09:30 AM",
    title: "Closing Ceremony",
    desc: "Results and celebration",
    icon: "🏆",
  },
];

function TimelineItem({
  event,
  index,
  isLeft,
}: {
  event: (typeof day1Events)[0];
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.04, ease: "easeOut" }}
      className={`relative flex items-center w-full mb-8 ${
        isLeft ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Content */}
      <div
        className={`w-full md:w-[calc(50%-40px)] ${isLeft ? "md:ml-auto md:pl-10" : "md:mr-auto md:pr-10"} pl-14 md:pl-0`}
      >
        <div className="glass-card p-3 sm:p-5 group hover:!border-primary/30">
          <div className="flex items-start gap-3">
            <span className="text-lg sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {event.icon}
            </span>
            <div>
              <span className="text-xs sm:text-xs font-[Gilroy-Bold] text-primary/80 tracking-wider">
                {event.time}
              </span>
              <h4 className="text-base sm:text-base font-[Gilroy-Bold] text-white mt-1">
                {event.title}
              </h4>
              <p className="text-sm sm:text-sm text-gray-400 font-[Gilroy-Light] mt-1 hidden sm:block">
                {event.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot */}
      <div className="timeline-dot" style={{ top: "24px" }} />
    </motion.div>
  );
}

export default function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="schedule" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="glow-bottom-center" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold tracking-widest text-primary uppercase mb-6">
            24 Hours of Innovation
          </span>
          <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
            EVENT TIMELINE
          </h2>
          <p className="section-subtitle mx-auto">
            From kickoff to closing ceremony — every moment planned for maximum
            impact.
          </p>
        </motion.div>

        {/* Day 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 mb-8">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="font-[Gilroy-Bold] text-primary tracking-wider text-xs sm:text-sm uppercase">
              Day 1 — Kickoff
            </span>
          </div>

          <div className="relative">
            <div className="timeline-line" />
            {day1Events.map((event, i) => (
              <TimelineItem
                key={i}
                event={event}
                index={i}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>
        </motion.div>

        {/* Day 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 mb-8">
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            <span className="font-[Gilroy-Bold] text-secondary tracking-wider text-xs sm:text-sm uppercase">
              Day 2 — Finale
            </span>
          </div>

          <div className="relative">
            <div className="timeline-line" />
            {day2Events.map((event, i) => (
              <TimelineItem
                key={i}
                event={event}
                index={i}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
