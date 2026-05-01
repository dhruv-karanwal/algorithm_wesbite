"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-emergency flex items-center justify-center text-white shadow-lg shadow-emergency/20 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">ERO <span className="text-primary">Optimizer</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Algorithms", "Simulation", "Analytics", "Scenarios"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link
            href="#simulation"
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Launch Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden bg-white dark:bg-slate-950 overflow-hidden"
      >
        <div className="p-4 space-y-4">
          {["Algorithms", "Simulation", "Analytics", "Scenarios"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium py-2 border-b border-slate-100 dark:border-slate-800"
            >
              {item}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
