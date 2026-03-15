"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/5 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-gray-500 text-sm">Dan Martell</p>
              </div>
            </div>
            {/* Accent border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gold-500/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
              The Story
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
              From rock bottom
              <br />
              to <span className="text-gold-500">$100M exits.</span>
            </h2>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                At 17, I was in a juvenile detention center — addicted, lost,
                and convinced I&apos;d never amount to anything. A counselor
                handed me a computer and everything changed.
              </p>
              <p>
                I taught myself to code, built my first software company, and
                discovered that entrepreneurship wasn&apos;t just a career — it
                was my way out. I went on to build and sell multiple companies
                including{" "}
                <span className="text-white font-medium">Clarity.fm</span>,{" "}
                <span className="text-white font-medium">Spheric</span>, and{" "}
                <span className="text-white font-medium">Flowtown</span>.
              </p>
              <p>
                Today, I run{" "}
                <span className="text-white font-medium">SaaS Academy</span>,
                the #1 coaching program for B2B SaaS founders. I&apos;ve angel
                invested in companies like Intercom, Udemy, and Hootsuite. And
                my book{" "}
                <span className="text-gold-500 font-medium">
                  Buy Back Your Time
                </span>{" "}
                hit the Wall Street Journal bestseller list.
              </p>
              <p>
                My mission is simple: help founders build companies that
                don&apos;t run them into the ground.
              </p>
            </div>

            <div className="mt-8 flex gap-6">
              <div className="border-l-2 border-gold-500 pl-4">
                <div className="text-2xl font-bold">3x</div>
                <div className="text-sm text-gray-500">Successful Exits</div>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-500">Angel Investments</div>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <div className="text-2xl font-bold">WSJ</div>
                <div className="text-sm text-gray-500">Bestselling Author</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
