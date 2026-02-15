"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ───────── Data ───────── */

const principal = {
  name: "Dr. G. Durga Sukumar",
  role: "Principal",
  qualifications: "M.Tech, Ph.D. (IIT Roorkee)",
  department: "Vignan Institute of Technology & Science",
  image: "/images/team/principal.jpg",
  quote:
    "At VITS, we strive to involve, engage, and enrich students' lives in a welcoming environment with a specific goal of producing energetic talent pool of global standards with Indian values.",
};

const hod = {
  name: "Dr. Raja Vikram",
  role: "Dean of Computing & HOD CSE",
  qualifications: "Ph.D.",
  department: "Computer Science & Engineering",
  image: "/images/team/hod.jpg",
  quote:
    "Innovation thrives when young minds collaborate. VHACK 2.0 is our commitment to nurturing the next generation of tech leaders.",
};

const facultyCoordinators = [
  {
    name: "Mr. Balaji",
    role: "Faculty Coordinator",
    department: "Computer Science & Engineering",
    image: "/images/team/faculty-1.jpg",
  },
];

const studentCoordinators = [
  {
    name: "Yashwanth Reddy K",
    role: "Lead Organizer",
    club: "AID-X",
    image: "/images/team/student-1.jpg",
  },
  {
    name: "Rahul Sharma",
    role: "Technical Lead",
    club: "Nexus",
    image: "/images/team/student-2.jpg",
  },
  {
    name: "Priya Patel",
    role: "Design Lead",
    club: "AID-X",
    image: "/images/team/student-3.jpg",
  },
  {
    name: "Aditya Verma",
    role: "Event Coordinator",
    club: "Nexus",
    image: "/images/team/student-4.jpg",
  },
  {
    name: "Sneha Reddy",
    role: "Marketing Lead",
    club: "AID-X",
    image: "/images/team/student-5.jpg",
  },
  {
    name: "Karthik Nair",
    role: "Operations Lead",
    club: "Nexus",
    image: "/images/team/student-6.jpg",
  },
];

/* ───────── Helpers ───────── */

function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="text-center mb-14"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold tracking-widest text-primary uppercase mb-6">
        {badge}
      </span>
      <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
        {title}
      </h2>
      <p className="section-subtitle mx-auto max-w-xl">{subtitle}</p>
    </motion.div>
  );
}

function PersonCard({
  person,
  index,
  large = false,
}: {
  person: {
    name: string;
    role: string;
    qualifications?: string;
    department?: string;
    club?: string;
    image: string;
    quote?: string;
  };
  index: number;
  large?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`glass-card group overflow-hidden h-full flex flex-col items-center 
        ${large ? "p-5 sm:p-8 md:p-10" : "p-4 sm:p-5 md:p-6"}`}
    >
      <div
        className={`flex w-full ${
          large
            ? "flex-row items-center text-left gap-4 sm:gap-6 md:gap-8"
            : "flex-col items-center text-center gap-3 sm:gap-4"
        }`}
      >
        {/* Photo Container */}
        <div
          className={`relative flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/30 transition-all duration-500
            ${large ? "w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40" : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"}`}
        >
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  person.name,
                )}&size=200&background=0d1117&color=00d4ff&bold=true&font-size=0.35`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info Container */}
        <div className="flex-1 w-full min-w-0">
          <h3
            className={`font-[Gilroy-Bold] text-white leading-tight break-words ${
              large ? "text-xl sm:text-2xl" : "text-sm sm:text-base md:text-lg"
            }`}
          >
            {person.name}
          </h3>

          <p
            className={`text-primary font-[Gilroy-Medium] mt-1 break-words ${
              large ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            }`}
          >
            {person.role}
          </p>

          {person.qualifications && (
            <p
              className={`text-gray-300 font-[Gilroy-Medium] break-words ${large ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"} mt-1 opacity-80`}
            >
              {person.qualifications}
            </p>
          )}

          {person.department && (
            <p className="text-gray-500 text-xs sm:text-sm font-[Gilroy-Light] mt-1 break-words">
              {person.department}
            </p>
          )}

          {person.club && (
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
                  person.club === "AID-X"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-secondary/10 text-secondary border border-secondary/20"
                }`}
              >
                {person.club}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── Page ───────── */

export default function AboutPage() {
  return (
    <main className="min-h-screen relative">
      <Navbar />

      {/* Background effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-[Gilroy-Heavy] text-white mb-3">
              About <span className="gradient-text">VHACK 2.0</span>
            </h1>
            <p className="text-gray-400 font-[Gilroy-Medium] max-w-2xl mx-auto">
              Meet the people who make it all happen — from our college
              leadership to the student organizers behind this hackathon.
            </p>
          </motion.div>

          {/* ── Leadership Section ── */}
          <section className="mb-24">
            <SectionHeader
              badge="👨‍💼 Leadership"
              title="OUR LEADERSHIP"
              subtitle="Guiding our vision for technical excellence"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="w-full">
                <PersonCard person={principal} index={0} large />
              </div>
              <div className="w-full">
                <PersonCard person={hod} index={1} large />
              </div>
            </div>
          </section>

          {/* ── Faculty Coordinators ── */}
          <section className="mb-24">
            <SectionHeader
              badge="👨‍🏫 Faculty"
              title="FACULTY COORDINATORS"
              subtitle="Mentoring and supporting the organizing team"
            />
            {/* Center the grid if few items, otherwise standard grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto ${facultyCoordinators.length === 1 ? "place-items-center" : ""}`}
            >
              {facultyCoordinators.map((person, i) => (
                <div key={person.name} className="w-full max-w-lg">
                  <PersonCard person={person} index={i} large />
                </div>
              ))}
            </div>
          </section>

          {/* ── Student Coordinators ── */}
          <section className="mb-24">
            <SectionHeader
              badge="🎓 Student Team"
              title="STUDENT COORDINATORS"
              subtitle="The driving force behind VHACK 2.0"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {studentCoordinators.map((person, i) => (
                <PersonCard key={person.name} person={person} index={i} />
              ))}
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-[Gilroy-Medium] transition-colors duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
