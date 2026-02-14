"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CollegeMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="location" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold tracking-widest text-primary uppercase mb-6">
            📍 Venue
          </span>
          <h2 className="section-title font-[Gilroy-Heavy] text-white mb-4">
            FIND US HERE
          </h2>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="glass-card p-2 sm:p-3 rounded-2xl overflow-hidden"
        >
          <iframe
            title="Vignan ITS Location"
            src="https://maps.google.com/maps?q=8PVC%2BVP+Deshmuki+Village+Deshmukhi+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[300px] sm:h-[400px] md:h-[450px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
