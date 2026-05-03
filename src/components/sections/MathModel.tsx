"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, Calculator, Settings } from "lucide-react";

export default function MathModel() {
  const [weights, setWeights] = useState({
    dist: 0.4,
    traffic: 0.3,
    cap: 0.2,
    avail: 0.1
  });

  return (
    <section id="math" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                The <span className="text-emergency">Mathematical</span> Model
              </h2>
              <p className="text-foreground/60 leading-relaxed">
                Hospital selection isn't just about the nearest building. We use a multi-factor 
                scoring algorithm to ensure the patient gets to the <strong>best</strong> possible 
                facility, not just the closest one.
              </p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-border">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Optimization Formula</h3>
              </div>

              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-border font-mono text-lg text-center shadow-inner">
                <span className="text-primary font-bold">Score</span> = 
                <span className="text-blue-500"> α·D</span> + 
                <span className="text-orange-500"> β·T</span> + 
                <span className="text-purple-500"> γ·C</span> + 
                <span className="text-green-500"> δ·A</span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60"><span className="text-blue-500 font-bold">α</span> Distance Factor</span>
                  <span className="font-bold">{(weights.dist * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={weights.dist}
                  onChange={(e) => setWeights({...weights, dist: parseFloat(e.target.value)})}
                  className="w-full accent-blue-500"
                />

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60"><span className="text-orange-500 font-bold">β</span> Traffic Multiplier</span>
                  <span className="font-bold">{(weights.traffic * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={weights.traffic}
                  onChange={(e) => setWeights({...weights, traffic: parseFloat(e.target.value)})}
                  className="w-full accent-orange-500"
                />

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60"><span className="text-purple-500 font-bold">γ</span> Capability Match</span>
                  <span className="font-bold">{(weights.cap * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={weights.cap}
                  onChange={(e) => setWeights({...weights, cap: parseFloat(e.target.value)})}
                  className="w-full accent-purple-500"
                />

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60"><span className="text-green-500 font-bold">δ</span> Facility Availability</span>
                  <span className="font-bold">{(weights.avail * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={weights.avail}
                  onChange={(e) => setWeights({...weights, avail: parseFloat(e.target.value)})}
                  className="w-full accent-green-500"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Distance (D)",
                  desc: "Physical path length between ambulance and hospital.",
                  icon: <Info className="w-4 h-4" />,
                  color: "border-blue-500/20 bg-blue-500/5"
                },
                {
                  title: "Traffic (T)",
                  desc: "Real-time congestion levels on the selected route.",
                  icon: <Info className="w-4 h-4" />,
                  color: "border-orange-500/20 bg-orange-500/5"
                },
                {
                  title: "Capability (C)",
                  desc: "Specialized departments (Trauma, Cardiac, ICU).",
                  icon: <Info className="w-4 h-4" />,
                  color: "border-purple-500/20 bg-purple-500/5"
                },
                {
                  title: "Availability (A)",
                  desc: "Current bed and emergency room occupancy.",
                  icon: <Info className="w-4 h-4" />,
                  color: "border-green-500/20 bg-green-500/5"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-3xl border ${item.color} space-y-3`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {item.title}
                  </div>
                  <p className="text-sm text-foreground/60">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Dynamic Decision Logic
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If a patient has a heart attack (Cardiac incident), the γ weight automatically 
                increases, potentially favoring a hospital with a specialized Cardiac unit even 
                if it's farther away. This is the core of "Informed Decision Making" in EMS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
