"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const channels = [
  {
    icon: "▶️",
    title: "YouTube",
    desc: "Weekly videos on SaaS growth, productivity, and entrepreneurship.",
    cta: "Subscribe",
    subs: "500K+ subscribers",
  },
  {
    icon: "🎙️",
    title: "Podcast",
    desc: "Deep dives with world-class founders and operators.",
    cta: "Listen",
    subs: "Top 50 Business",
  },
  {
    icon: "📧",
    title: "Newsletter",
    desc: "One actionable SaaS growth tip every week. Free.",
    cta: "Subscribe",
    subs: "200K+ readers",
  },
];

export default function ContentHub() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="content" className="py-24 md:py-32 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
            Content
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
            Learn from <span className="text-gold-500">everywhere.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Free content to help you grow your SaaS, buy back your time, and
            build a life you don&apos;t need a vacation from.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {channels.map((ch, i) => (
            <motion.div
              key={ch.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold-500/30 transition-all group"
            >
              <div className="text-4xl mb-4">{ch.icon}</div>
              <h3 className="text-xl font-bold mb-2">{ch.title}</h3>
              <p className="text-gray-500 text-sm mb-1">{ch.subs}</p>
              <p className="text-gray-400 mb-6">{ch.desc}</p>
              <a
                href="#"
                className="inline-block border border-white/20 px-5 py-2.5 rounded-lg text-sm font-medium group-hover:border-gold-500 group-hover:text-gold-500 transition-all"
              >
                {ch.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
