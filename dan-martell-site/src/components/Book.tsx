"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const frameworks = [
  {
    title: "The Buyback Principle",
    desc: "Don't hire to grow your business. Hire to buy back your time.",
  },
  {
    title: "The Replacement Ladder",
    desc: "A step-by-step system for delegating everything that drains you.",
  },
  {
    title: "The DRIP Matrix",
    desc: "Identify what to delegate, replace, invest in, or produce.",
  },
  {
    title: "The Energy Audit",
    desc: "Find the tasks that steal your energy and eliminate them.",
  },
];

export default function Book() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -15, y: x * 15 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="book" className="py-24 md:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/[0.03] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Book cover with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                {/* Book visual */}
                <div className="w-64 h-80 md:w-80 md:h-[26rem] rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 shadow-2xl shadow-gold-500/20 flex flex-col items-center justify-center p-8 text-navy-900">
                  <div className="text-xs font-bold tracking-widest uppercase mb-4 opacity-70">
                    Wall Street Journal Bestseller
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-center leading-tight">
                    BUY BACK
                    <br />
                    YOUR TIME
                  </div>
                  <div className="w-12 h-0.5 bg-navy-900/30 my-4" />
                  <div className="text-sm font-semibold">DAN MARTELL</div>
                </div>

                {/* WSJ badge */}
                <div className="absolute -top-4 -right-4 bg-white text-navy-900 rounded-full w-20 h-20 flex items-center justify-center text-center shadow-xl">
                  <div>
                    <div className="text-[10px] font-bold leading-tight">
                      WSJ
                    </div>
                    <div className="text-[8px] leading-tight">#1 Best Seller</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Book details */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
              The Book
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-6">
              Buy Back <span className="text-gold-500">Your Time</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              The counter-intuitive guide to getting unstuck, reclaiming your
              freedom, and building your empire. Used by thousands of founders
              to escape the operator trap and scale without burning out.
            </p>

            {/* Key frameworks */}
            <div className="space-y-4 mb-8">
              {frameworks.map((fw, i) => (
                <motion.div
                  key={fw.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">{fw.title}</div>
                    <div className="text-sm text-gray-500">{fw.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Buy links */}
            <div className="flex flex-wrap gap-3">
              {["Amazon", "Audible", "Barnes & Noble"].map((store) => (
                <a
                  key={store}
                  href="#"
                  className="border border-white/20 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-gold-500 hover:text-gold-500 transition-all"
                >
                  {store}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
