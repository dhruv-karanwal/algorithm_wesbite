"use client";

import { motion } from "framer-motion";
import { 
  CloudRain, 
  Car, 
  Construction, 
  Hospital, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const SCENARIOS = [
  {
    title: "Heavy Traffic Hours",
    description: "During peak hours, city centers experience a 300% increase in travel time. Our system dynamically adjusts weights.",
    icon: <Car className="w-6 h-6" />,
    solution: "Dijkstra / A*",
    reason: "Accounts for weighted edges (traffic) to find the fastest time, even if the distance is longer.",
    color: "bg-orange-500",
  },
  {
    title: "Major Road Blocked",
    description: "Accidents or construction can completely sever a primary route. The system must find an alternative immediately.",
    icon: <Construction className="w-6 h-6" />,
    solution: "A* Search",
    reason: "Heuristic search quickly pivots to the next best geographic direction when a node is disconnected.",
    color: "bg-red-500",
  },
  {
    title: "Multiple Hospital Choice",
    description: "An ambulance needs to choose between 3 hospitals based on current traffic and distance.",
    icon: <Hospital className="w-6 h-6" />,
    solution: "Dijkstra (Multi-target)",
    reason: "One-to-many search determines the closest destination among all available hospital nodes.",
    color: "bg-blue-500",
  },
  {
    title: "Normal Operations",
    description: "Late night operations with clear roads. Focus shifts to absolute shortest geometric distance.",
    icon: <CloudRain className="w-6 h-6" />,
    solution: "BFS / Dijkstra",
    reason: "With uniform weights, simple BFS or standard Dijkstra finds the shortest physical path.",
    color: "bg-green-500",
  },
];

export default function Scenarios() {
  return (
    <section id="scenarios" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Real-World <span className="text-emergency">Scenarios</span>
          </h2>
          <p className="text-foreground/60">
            How our algorithms adapt to the unpredictable nature of urban environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCENARIOS.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] border border-border hover:border-primary/50 transition-all bg-card hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${scenario.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                  {scenario.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  Case 0{index + 1}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{scenario.title}</h3>
              <p className="text-sm text-foreground/60 mb-8 leading-relaxed">
                {scenario.description}
              </p>

              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-foreground/40">Best Algorithm</div>
                    <div className="text-sm font-bold">{scenario.solution}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground/40 flex items-center justify-center shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-foreground/40">Technical Rationale</div>
                    <div className="text-xs text-foreground/70 mt-0.5">{scenario.reason}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
