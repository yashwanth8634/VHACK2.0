"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";

// Seeded particle positions (fixed values to avoid hydration mismatch)
const particles = [
  { id: 0, size: 2.1, x: 12, y: 8, duration: 5.2, delay: 0.3 },
  { id: 1, size: 1.4, x: 87, y: 15, duration: 6.1, delay: 1.2 },
  { id: 2, size: 3.2, x: 45, y: 92, duration: 4.5, delay: 2.1 },
  { id: 3, size: 1.8, x: 23, y: 67, duration: 7.3, delay: 0.8 },
  { id: 4, size: 2.5, x: 76, y: 43, duration: 5.8, delay: 1.5 },
  { id: 5, size: 1.2, x: 34, y: 28, duration: 6.7, delay: 2.8 },
  { id: 6, size: 3.5, x: 91, y: 72, duration: 4.2, delay: 0.1 },
  { id: 7, size: 2.8, x: 58, y: 5, duration: 5.5, delay: 1.9 },
  { id: 8, size: 1.6, x: 7, y: 85, duration: 7.1, delay: 2.4 },
  { id: 9, size: 2.3, x: 65, y: 55, duration: 4.8, delay: 0.6 },
  { id: 10, size: 3.1, x: 19, y: 38, duration: 6.3, delay: 1.7 },
  { id: 11, size: 1.9, x: 82, y: 91, duration: 5.1, delay: 2.6 },
  { id: 12, size: 2.7, x: 50, y: 18, duration: 7.5, delay: 0.4 },
  { id: 13, size: 1.3, x: 38, y: 75, duration: 4.4, delay: 1.1 },
  { id: 14, size: 3.8, x: 72, y: 62, duration: 6.9, delay: 2.2 },
  { id: 15, size: 2.0, x: 15, y: 48, duration: 5.6, delay: 0.9 },
  { id: 16, size: 1.7, x: 94, y: 32, duration: 4.1, delay: 1.4 },
  { id: 17, size: 3.4, x: 28, y: 95, duration: 7.8, delay: 2.7 },
];

// Floating tech icons for background decoration
const floatingIcons = [
  {
    icon: "💻",
    size: "text-2xl sm:text-3xl",
    x: 8,
    y: 15,
    delay: 0,
    showMobile: true,
  },
  {
    icon: "🤖",
    size: "text-xl sm:text-2xl",
    x: 85,
    y: 20,
    delay: 1.2,
    showMobile: false,
  },
  {
    icon: "⚡",
    size: "text-xl sm:text-2xl",
    x: 12,
    y: 70,
    delay: 0.8,
    showMobile: true,
  },
  {
    icon: "🔒",
    size: "text-2xl sm:text-3xl",
    x: 90,
    y: 65,
    delay: 2,
    showMobile: true,
  },
  {
    icon: "🚀",
    size: "text-xl sm:text-2xl",
    x: 18,
    y: 88,
    delay: 2.5,
    showMobile: true,
  },
  {
    icon: "🔥",
    size: "text-xl sm:text-2xl",
    x: 70,
    y: 10,
    delay: 3,
    showMobile: true,
  },
  { icon: "🎯", size: "text-lg", x: 75, y: 75, delay: 2.2, showMobile: false },
  {
    icon: "🛡️",
    size: "text-xl sm:text-2xl",
    x: 60,
    y: 5,
    delay: 2.8,
    showMobile: false,
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-badge",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".hero-presents",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.3",
        )
        .fromTo(
          ".hero-title-char",
          { y: 80, opacity: 0, rotateX: 40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.06 },
          "-=0.2",
        )
        .fromTo(
          ".hero-version",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.3",
        )
        .fromTo(
          ".hero-line-l",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, transformOrigin: "right" },
          "-=0.4",
        )
        .fromTo(
          ".hero-line-r",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, transformOrigin: "left" },
          "-=0.5",
        )
        .fromTo(
          ".hero-tagline",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          ".hero-tag",
          { y: 15, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 },
          "-=0.2",
        )
        .fromTo(
          ".hero-info",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.1",
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        );

      // Floating animation for particles
      gsap.utils.toArray<HTMLElement>(".hero-particle").forEach((el) => {
        gsap.to(el, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: "random(0, 3)",
        });
      });

      // Floating tech icons animation
      gsap.utils.toArray<HTMLElement>(".floating-icon").forEach((el) => {
        gsap.to(el, {
          y: "random(-25, 25)",
          x: "random(-15, 15)",
          rotation: "random(-20, 20)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: "random(0, 3)",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse follow glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !mouseGlowRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(mouseGlowRef.current, {
        left: x - 200,
        top: y - 200,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const hero = heroRef.current;
    hero?.addEventListener("mousemove", handleMouseMove);
    return () => hero?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const titleChars = "VHACK".split("");

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8"
    >
      {/* Mouse-follow glow */}
      <div
        ref={mouseGlowRef}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.07] hidden md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.4), rgba(168,85,247,0.2), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Ambient glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-20 -right-40 w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />

      {/* Animated particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background:
              p.id % 3 === 0
                ? "var(--primary)"
                : p.id % 3 === 1
                  ? "var(--secondary)"
                  : "var(--accent)",
            opacity: 0.25,
          }}
        />
      ))}

      {/* Floating tech icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`floating-icon absolute pointer-events-none opacity-25 ${item.size} ${
            item.showMobile ? "block" : "hidden sm:block"
          }`}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.icon}
        </div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* College badge with logo layout */}
        <div className="hero-badge inline-flex flex-col items-center gap-4 sm:gap-5 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-6 sm:mb-8 opacity-0">
          {/* Vignan logo - top center (large) */}
          <a href="https://vignanits.ac.in/">
            <img
              src="/images/1595497656733.png"
              alt="Vignan ITS Logo"
              className="h-16 sm:h-20 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-110"
            />
          </a>
          {/* Nexus left, AID-X right (smaller) */}
          <div className="flex items-center justify-center w-full gap-4 sm:gap-10">
            <div className="bg-white rounded-xl w-[130px] h-[50px] sm:w-[150px] sm:h-[55px] md:w-[150px] md:h-[55px] flex items-center justify-center transition-all duration-300 hover:scale-110">
              <img
                src="/images/nexus_m.png"
                alt="Nexus Club"
                className="max-h-[36px] sm:max-h-[40px] md:max-h-[40px] w-auto object-contain"
              />
            </div>
            <div className="bg-white rounded-xl w-[130px] h-[50px] sm:w-[150px] sm:h-[55px] md:w-[150px] md:h-[55px] flex items-center justify-center transition-all duration-300 hover:scale-110">
              <img
                src="/images/aidx-logo.webp"
                alt="AID-X Club"
                className="max-h-[36px] sm:max-h-[40px] md:max-h-[40px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Presents */}
        <p className="hero-presents text-gray-500 font-[Gilroy-Medium] text-base sm:text-lg tracking-[0.3em] uppercase mb-3 sm:mb-4 opacity-0">
          presents
        </p>

        {/* VHACK Title — GSAP per-character animation */}
        <h1
          ref={titleRef}
          className="mb-2 overflow-hidden"
          style={{ perspective: "600px" }}
        >
          <span className="inline-flex">
            {titleChars.map((char, i) => (
              <span
                key={i}
                className="hero-title-char inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-[Gilroy-Heavy] tracking-tight gradient-text opacity-0"
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* 2.0 with lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="hero-line-l h-[2px] w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent to-primary" />
          <span className="hero-version text-4xl sm:text-5xl md:text-6xl font-[Gilroy-Heavy] text-white opacity-0">
            2.0
          </span>
          <div className="hero-line-r h-[2px] w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent to-secondary" />
        </div>

        {/* Tagline */}
        <p className="hero-tagline text-xl sm:text-2xl md:text-3xl text-gray-400 font-[Gilroy-Medium] mb-4 sm:mb-6 max-w-2xl mx-auto opacity-0">
          24 Hours of{" "}
          <span className="text-primary font-[Gilroy-Bold]">
            Pure Innovation
          </span>
        </p>

        {/* Domain tags — compact on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {[
            "Agentic AI",
            "Cybersecurity",
            "Fintech",
            "Blockchain",
            "Web3",
            "IoT",
          ].map((tag) => (
            <span
              key={tag}
              className="hero-tag px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm sm:text-sm font-[Gilroy-Medium] text-gray-300 hover:border-primary/40 hover:text-primary hover:bg-primary/[0.05] transition-all duration-300 cursor-default opacity-0"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date & Location */}
        <div className="hero-info flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 mb-8 sm:mb-10 opacity-0">
          <div className="flex items-center gap-2 text-gray-300">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-[Gilroy-Bold] text-base sm:text-lg">
              27 – 28 February, 2026
            </span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary/50" />
          <div className="flex items-center gap-2 text-gray-300">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-[Gilroy-Bold] text-base sm:text-lg">
              VITS, Hyderabad
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="https://unstop.com/hackathons/vhack-20"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta glow-btn text-base sm:text-lg !px-8 sm:!px-10 !py-3.5 sm:!py-4 w-full sm:w-auto opacity-0"
          >
            Register Now
          </a>
          <Link
            href="/#domains"
            className="hero-cta outline-btn text-base sm:text-lg !px-8 sm:!px-10 !py-3.5 sm:!py-4 w-full sm:w-auto opacity-0"
          >
            Explore Domains
          </Link>
        </div>
      </div>
    </section>
  );
}