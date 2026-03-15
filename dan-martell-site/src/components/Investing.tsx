"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const portfolio = [
  "Intercom",
  "Udemy",
  "Hootsuite",
  "Unbounce",
  "GetResponse",
  "AgoraPulse",
  "Proposify",
  "ClickFunnels",
];

const criteria = [
  { title: "B2B SaaS", desc: "Recurring revenue software companies." },
  { title: "$1M-$5M ARR", desc: "Post product-market fit, pre-scale." },
  { title: "Founder-led", desc: "Driven founders who obsess over their customers." },
  { title: "Capital efficient", desc: "Smart growth, not just growth at all costs." },
];

export default function Investing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="investing"
      className="py-24 md:py-32 relative"
      ref={ref}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-800 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
            Angel Investing
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
            Backing the next generation
            <br />
            of <span className="text-gold-500">SaaS leaders.</span>
          </h2>
        </motion.div>

        {/* Portfolio logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {portfolio.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center hover:border-gold-500/30 transition-all group"
            >
              <div className="text-lg font-bold text-gray-500 group-hover:text-white transition-colors">
                {name}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* What I look for */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-6">What I look for</h3>
            <div className="space-y-4">
              {criteria.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{c.title}</span>
                    <span className="text-gray-500"> — {c.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            <h3 className="text-xl font-bold mb-4">Want to pitch?</h3>
            <p className="text-gray-400 mb-6">
              I invest in 5-10 companies per year. If you&apos;re building a B2B
              SaaS company and think we&apos;d be a good fit, I&apos;d love to
              hear from you.
            </p>
            <a
              href="#"
              className="inline-block border border-gold-500 text-gold-500 px-6 py-3 rounded-xl font-semibold hover:bg-gold-500 hover:text-navy-900 transition-all"
            >
              Submit Your Pitch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
