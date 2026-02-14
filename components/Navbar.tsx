"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Domains", href: "/#domains" },
    { label: "Prizes", href: "/#prizes" },
    { label: "Schedule", href: "/#schedule" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src=""
                  alt="VHACK LOGO"
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300"
                />
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
              </div>
              <span className="font-[Gilroy-Bold] text-xl tracking-tight text-white">
                VHACK <span className="text-primary">2.0</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-[Gilroy-Medium] text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 tracking-wide uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="hidden sm:inline-flex glow-btn !py-3 !px-6 !text-sm !rounded-xl"
              >
                Register Now
              </Link>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div className="flex md:hidden items-center justify-between h-20 w-full relative">
            {/* Left: VHACK Logo */}
            <div className="flex-1 flex justify-start">
              <Link href="/">
                <span className="font-[Gilroy-Bold] text-lg tracking-tight text-white">
                  VHACK <span className="text-primary">2.0</span>
                </span>
              </Link>
            </div>

            {/* Center: Vignan Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/">
                <img
                  src="https://vignanits.ac.in/wp-content/uploads/2020/07/1595497656733.png"
                  alt="Vignan ITS Logo"
                  className="w-10 h-10 rounded-lg object-contain bg-white/10"
                />
              </Link>
            </div>

            {/* Right: Hamburger Toggle */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5 items-center">
                  <motion.span
                    animate={
                      mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
                    }
                    className="block w-5 h-[2px] bg-white transition-all"
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block w-5 h-[2px] bg-white transition-all"
                  />
                  <motion.span
                    animate={
                      mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
                    }
                    className="block w-5 h-[2px] bg-white transition-all"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-dark-100/95 backdrop-blur-2xl border-l border-white/5 p-8 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-4 text-lg font-[Gilroy-Medium] text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="glow-btn w-full"
                  >
                    Register Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
