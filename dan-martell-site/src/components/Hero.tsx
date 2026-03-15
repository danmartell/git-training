"use client";

import { motion } from "framer-motion";

const headlineWords = [
  "I",
  "help",
  "SaaS",
  "founders",
  "buy",
  "back",
  "their",
  "time",
  "and",
  "scale",
  "to",
  "exit.",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-8"
        >
          <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase border border-gold-500/30 rounded-full px-4 py-2">
            #1 SaaS Coaching Program
          </span>
        </motion.div>

        {/* Staggered headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-8">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className={`inline-block mr-3 ${
                ["SaaS", "buy", "back", "time"].includes(word)
                  ? "text-gold-500"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
        >
          Serial entrepreneur. Wall Street Journal bestselling author. Angel
          investor. Helping founders build companies worth owning.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#book"
            className="bg-gold-500 text-navy-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gold-400 transition-all hover:scale-105"
          >
            Get the Book
          </a>
          <a
            href="#saas-academy"
            className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:border-gold-500 hover:text-gold-500 transition-all"
          >
            Work With Me
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "$100M+", label: "Revenue Generated" },
            { value: "3", label: "Successful Exits" },
            { value: "1,000+", label: "SaaS Founders Coached" },
            { value: "50+", label: "Companies Invested" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 + i * 0.15 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-gold-500">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
