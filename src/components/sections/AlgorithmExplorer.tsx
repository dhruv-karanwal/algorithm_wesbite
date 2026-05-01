"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Brain, LayoutGrid, Timer } from "lucide-react";

const ALGORITHMS = [
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    icon: <Timer className="w-6 h-6" />,
    description: "The classic shortest path algorithm that finds the most efficient route between nodes.",
    complexity: { time: "O(V²)", space: "O(V)" },
    useCase: "Ideal for static maps with known distances.",
    advantage: "Guarantees the shortest path.",
    limitation: "Can be slow on very large graphs without optimization.",
  },
  {
    id: "astar",
    name: "A* Search",
    icon: <Brain className="w-6 h-6" />,
    description: "An informed search algorithm that uses heuristics to guide the search towards the goal.",
    complexity: { time: "O(E)", space: "O(V)" },
    useCase: "Best for real-time routing with distance heuristics.",
    advantage: "Faster than Dijkstra for point-to-point.",
    limitation: "Heuristic must be admissible for optimality.",
  },
  {
    id: "bfs",
    name: "Breadth-First Search",
    icon: <LayoutGrid className="w-6 h-6" />,
    description: "Explores all neighbor nodes at the present depth before moving to the next level.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    useCase: "Unweighted graphs or finding minimum steps.",
    advantage: "Simple and robust for connectivity.",
    limitation: "Does not consider edge weights (traffic).",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    icon: <Zap className="w-6 h-6" />,
    description: "Explores as far as possible along each branch before backtracking.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    useCase: "Topological sorting or finding any path.",
    advantage: "Low memory usage for deep paths.",
    limitation: "Not suitable for finding shortest paths.",
  },
  {
    id: "greedy",
    name: "Greedy BFS",
    icon: <Clock className="w-6 h-6" />,
    description: "Always expands the node that appears to be closest to the goal based on heuristics.",
    complexity: { time: "O(V log V)", space: "O(V)" },
    useCase: "Fast pathfinding where optimality is secondary.",
    advantage: "Extremely fast execution.",
    limitation: "Can get stuck in local optima.",
  },
];

export default function AlgorithmExplorer() {
  return (
    <section id="algorithms" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Learn the <span className="text-primary">Algorithms</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Our route optimizer utilizes multiple Graph Data Structures and Algorithms 
            to ensure emergency vehicles reach their destination through the best possible path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALGORITHMS.map((algo, index) => (
            <motion.div
              key={algo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {algo.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{algo.name}</h3>
              <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                {algo.description}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold mb-1">Time</div>
                    <div className="font-mono text-xs text-primary">{algo.complexity.time}</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                    <div className="text-[10px] uppercase tracking-wider text-foreground/40 font-bold mb-1">Space</div>
                    <div className="font-mono text-xs text-primary">{algo.complexity.space}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <span className="text-foreground/80 font-medium">Best for: <span className="font-normal opacity-70">{algo.useCase}</span></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span className="text-foreground/80 font-medium">Advantage: <span className="font-normal opacity-70">{algo.advantage}</span></span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span className="text-foreground/80 font-medium">Limit: <span className="font-normal opacity-70">{algo.limitation}</span></span>
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
