"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const topics = [
  {
    title: "Buy Back Your Time",
    desc: "How to escape the operator trap and scale without burning out.",
  },
  {
    title: "The SaaS Playbook",
    desc: "Frameworks for scaling B2B SaaS from $1M to $10M+ ARR.",
  },
  {
    title: "From Rock Bottom to $100M",
    desc: "Overcoming adversity and using entrepreneurship as a vehicle for change.",
  },
];

const stages = [
  "Tony Robbins",
  "John Maxwell",
  "SaaStr",
  "Web Summit",
  "Dreamforce",
  "Traffic & Conversion",
];

export default function Speaking() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="speaking" className="py-24 md:py-32 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
              Speaking
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
              Keynotes that
              <br />
              <span className="text-gold-500">move people.</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              I&apos;ve spoken on stages alongside Tony Robbins and John
              Maxwell, delivered keynotes to audiences of 10,000+, and my
              talks have been viewed millions of times online.
            </p>

            {/* Topics */}
            <div className="space-y-4 mb-8">
              {topics.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold-500/30 transition-colors"
                >
                  <div className="font-semibold text-white">{topic.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {topic.desc}
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="#"
              className="inline-block border border-gold-500 text-gold-500 px-8 py-3 rounded-xl font-semibold hover:bg-gold-500 hover:text-navy-900 transition-all"
            >
              Book Dan to Speak
            </a>
          </motion.div>

          {/* Past stages */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/5 flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="text-5xl mb-2">🎤</div>
                <p className="text-gray-500 text-sm">Speaking reel</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 uppercase tracking-widest mb-4">
              Past Stages
            </p>
            <div className="flex flex-wrap gap-3">
              {stages.map((stage) => (
                <span
                  key={stage}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:border-gold-500/30 hover:text-white transition-all"
                >
                  {stage}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
