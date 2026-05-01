"use client";

import { motion } from "framer-motion";
import { Activity, Map as MapIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-background z-10" />
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Animated Map Lines */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.path
            d="M -100 200 Q 400 50 800 300 T 1400 100"
            fill="none"
            stroke="var(--color-emergency)"
            strokeWidth="2"
            strokeDasharray="10, 10"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />
          <motion.path
            d="M -100 400 Q 600 600 1000 400 T 1600 500"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeDasharray="5, 15"
            animate={{ strokeDashoffset: [0, 100] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/10 text-emergency border border-emergency/20 mb-6 backdrop-blur-sm">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Critical Response DSA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Emergency <span className="text-gradient">Route Optimizer</span>
          </h1>
          
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Smart ambulance routing powered by advanced Graph Algorithms. 
            Reducing response times when every second counts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#simulation"
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              Run Simulation
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="#algorithms"
              className="px-8 py-4 glass text-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all hover:scale-105 border-white/10"
            >
              <MapIcon className="w-5 h-5" />
              Explore Algorithms
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats Preview */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Algorithms", value: "5+" },
          { label: "Optimal Paths", value: "99.9%" },
          { label: "Avg Reduction", value: "34%" },
          { label: "Live Traffic", value: "YES" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-dark p-4 rounded-2xl text-center"
          >
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs text-foreground/50 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
