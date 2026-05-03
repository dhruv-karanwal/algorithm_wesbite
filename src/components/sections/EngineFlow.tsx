"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  Layers, 
  Cpu, 
  MapPin, 
  ArrowRight,
  Database,
  TrendingDown
} from "lucide-react";

const STEPS = [
  {
    id: "incident",
    title: "Incident Trigger",
    icon: <AlertCircle className="w-6 h-6" />,
    description: "System detects emergency (e.g., Heart Attack) with specific medical requirements.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    id: "priority",
    title: "Min Heap Queue",
    icon: <Database className="w-6 h-6" />,
    description: "Hospitals are ranked using a Priority Queue based on distance and capability scores.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: "process",
    title: "Algorithm Engine",
    icon: <Cpu className="w-6 h-6" />,
    description: "A* or Dijkstra computes the optimal path avoiding roadblocks and traffic.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: "result",
    title: "Optimized Route",
    icon: <MapPin className="w-6 h-6" />,
    description: "The best possible route is dispatched to the ambulance in real-time.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

export default function EngineFlow() {
  return (
    <section id="flow" className="py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">
            Algorithm <span className="text-primary">Engine Flow</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From the moment an emergency is reported to the final route dispatch, 
            our system executes a precise sequence of computational steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-800 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] hover:border-primary/50 transition-all duration-500 h-full">
                  <div className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">0{index + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden mt-6 flex justify-center">
                      <ArrowRight className="w-5 h-5 text-slate-700 rotate-90" />
                    </div>
                  )}
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-slate-950 border border-slate-800 rounded-full items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 p-8 bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-3xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Computational Complexity</h4>
            <p className="text-slate-400 text-sm">
              By using a <strong>Binary Min Heap</strong> for hospital selection, we reduce the search space 
              from $O(N)$ to $O(\log N)$. When combined with <strong>A* Search</strong>, the route 
              computation time is minimized by focusing on the most promising nodes first.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
