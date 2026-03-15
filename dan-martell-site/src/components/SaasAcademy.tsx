"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const results = [
  { metric: "2-5x", desc: "Revenue growth in 12 months" },
  { metric: "20hrs", desc: "Saved per week on average" },
  { metric: "92%", desc: "Client retention rate" },
  { metric: "500+", desc: "Active members" },
];

const logos = [
  "TechCo",
  "ScaleUp",
  "CloudHQ",
  "DataSync",
  "FlowAI",
  "MetricStack",
];

export default function SaasAcademy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="saas-academy"
      className="py-24 md:py-32 relative"
      ref={ref}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
            SaaS Academy
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
            The #1 coaching program for
            <br />
            <span className="text-gold-500">B2B SaaS founders.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A proven system to help you scale your SaaS company, build a
            world-class team, and buy back your time — without sacrificing
            your health or relationships.
          </p>
        </motion.div>

        {/* Results grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {results.map((r, i) => (
            <motion.div
              key={r.desc}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold-500/30 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-gold-500">
                {r.metric}
              </div>
              <div className="text-sm text-gray-500 mt-2">{r.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Client logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <p className="text-center text-sm text-gray-600 uppercase tracking-widest mb-8">
            Trusted by founders at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {logos.map((name) => (
              <div
                key={name}
                className="text-gray-600 font-bold text-lg tracking-wider hover:text-gray-400 transition-colors"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <a
            href="#"
            className="inline-block bg-gold-500 text-navy-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gold-400 transition-all hover:scale-105"
          >
            Apply to SaaS Academy
          </a>
          <p className="text-gray-600 text-sm mt-4">
            Limited spots available. Application required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
