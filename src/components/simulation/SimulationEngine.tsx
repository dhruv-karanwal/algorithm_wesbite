"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Settings2,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import { 
  Node, 
  Edge, 
  AlgorithmResult, 
  dijkstra, 
  aStar, 
  bfs, 
  dfs, 
  greedy 
} from "@/lib/algorithms";

// Initial City Graph Data
const INITIAL_NODES: Node[] = [
  { id: "1", name: "Station A", x: 100, y: 100 },
  { id: "2", name: "Hub B", x: 300, y: 100 },
  { id: "3", name: "Junction C", x: 500, y: 100 },
  { id: "4", name: "Cross D", x: 100, y: 300 },
  { id: "5", name: "Center E", x: 300, y: 300 },
  { id: "6", name: "Junction F", x: 500, y: 300 },
  { id: "7", name: "Hospital G", x: 100, y: 500 },
  { id: "8", name: "Hub H", x: 300, y: 500 },
  { id: "9", name: "Clinic I", x: 500, y: 500 },
];

const INITIAL_EDGES: Edge[] = [
  { source: "1", destination: "2", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "2", destination: "3", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "1", destination: "4", weight: 8, trafficMultiplier: 1, isBlocked: false },
  { source: "2", destination: "5", weight: 15, trafficMultiplier: 2, isBlocked: false },
  { source: "3", destination: "6", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "6", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "7", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "8", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "6", destination: "9", weight: 15, trafficMultiplier: 1, isBlocked: false },
  { source: "7", destination: "8", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "9", weight: 12, trafficMultiplier: 1, isBlocked: false },
  // Reverse edges for bi-directional (simplification)
  { source: "2", destination: "1", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "3", destination: "2", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "1", weight: 8, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "2", weight: 15, trafficMultiplier: 2, isBlocked: false },
  { source: "6", destination: "3", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "4", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "6", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "7", destination: "4", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "9", destination: "6", weight: 15, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "7", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "9", destination: "8", weight: 12, trafficMultiplier: 1, isBlocked: false },
];

export default function SimulationEngine() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [source, setSource] = useState<string>("1");
  const [dest, setDest] = useState<string>("9");
  const [activeAlgo, setActiveAlgo] = useState<string>("dijkstra");
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    setResult(null);
    
    // Simulate thinking delay
    setTimeout(() => {
      let res: AlgorithmResult;
      switch (activeAlgo) {
        case "dijkstra": res = dijkstra(nodes, edges, source, dest); break;
        case "astar": res = aStar(nodes, edges, source, dest); break;
        case "bfs": res = bfs(nodes, edges, source, dest); break;
        case "dfs": res = dfs(nodes, edges, source, dest); break;
        case "greedy": res = greedy(nodes, edges, source, dest); break;
        default: res = dijkstra(nodes, edges, source, dest);
      }
      setResult(res);
      setIsRunning(false);
    }, 600);
  }, [activeAlgo, source, dest, nodes, edges]);

  const toggleBlock = (s: string, d: string) => {
    setEdges(prev => prev.map(e => {
      if ((e.source === s && e.destination === d) || (e.source === d && e.destination === s)) {
        return { ...e, isBlocked: !e.isBlocked };
      }
      return e;
    }));
  };

  const adjustTraffic = (s: string, d: string, delta: number) => {
    setEdges(prev => prev.map(e => {
      if ((e.source === s && e.destination === d) || (e.source === d && e.destination === s)) {
        return { ...e, trafficMultiplier: Math.max(1, e.trafficMultiplier + delta) };
      }
      return e;
    }));
  };

  const pathEdges = useMemo(() => {
    if (!result || !result.path.length) return [];
    const pEdges: string[] = [];
    for (let i = 0; i < result.path.length - 1; i++) {
      pEdges.push(`${result.path[i].id}-${result.path[i+1].id}`);
      pEdges.push(`${result.path[i+1].id}-${result.path[i].id}`);
    }
    return pEdges;
  }, [result]);

  return (
    <section id="simulation" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Controls Panel */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Interactive <span className="text-emergency">Simulation</span></h2>
              <p className="text-foreground/60 text-sm">Configure the city grid and see how different algorithms adapt to traffic and road blocks.</p>
            </div>

            <div className="glass-dark p-6 rounded-3xl border-slate-800 space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Select Algorithm</label>
                <div className="grid grid-cols-1 gap-2">
                  {["dijkstra", "astar", "bfs", "dfs", "greedy"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setActiveAlgo(a)}
                      className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border ${
                        activeAlgo === a 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-slate-800/50 border-slate-700 text-foreground/70 hover:border-slate-500"
                      }`}
                    >
                      {a.charAt(0).toUpperCase() + a.slice(1).replace("astar", "A* Search").replace("greedy", "Greedy BFS")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Source</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  >
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Destination</label>
                  <select 
                    value={dest} 
                    onChange={(e) => setDest(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  >
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full py-4 bg-emergency text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emergency/90 transition-all disabled:opacity-50"
              >
                {isRunning ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {isRunning ? "Calculating..." : "Run Algorithm"}
              </button>
            </div>

            {/* Live Results Card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/5 border border-primary/20 p-6 rounded-3xl"
                >
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Simulation Results
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-foreground/40 font-bold">Total Cost</div>
                      <div className="text-xl font-bold text-primary">{result.totalWeight.toFixed(1)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-foreground/40 font-bold">Visited Nodes</div>
                      <div className="text-xl font-bold text-primary">{result.nodesVisited}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-foreground/40 font-bold">Time Taken</div>
                      <div className="text-xl font-bold text-primary">{result.executionTime.toFixed(2)}ms</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase text-foreground/40 font-bold">Path Length</div>
                      <div className="text-xl font-bold text-primary">{result.path.length} nodes</div>
                    </div>
                  </div>
                  {result.path.length === 0 && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      No path found! Roads might be blocked.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Visualization Area */}
          <div className="w-full lg:w-2/3 relative">
            <div className="bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border border-border p-4 relative overflow-hidden shadow-inner">
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                 <div className="px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-border">
                    <div className="w-2 h-2 rounded-full bg-emergency shadow-sm shadow-emergency/50" /> Road Blocked
                 </div>
                 <div className="px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-border">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" /> High Traffic
                 </div>
              </div>

              <svg viewBox="0 0 600 600" className="w-full h-auto">
                {/* Connections */}
                {edges.map((edge, i) => {
                  const s = nodes.find(n => n.id === edge.source)!;
                  const d = nodes.find(n => n.id === edge.destination)!;
                  const isPath = pathEdges.includes(`${edge.source}-${edge.destination}`);
                  
                  // Avoid double rendering for bi-directional
                  if (parseInt(edge.source) > parseInt(edge.destination)) return null;

                  return (
                    <g key={`edge-${i}`}>
                      <line
                        x1={s.x} y1={s.y} x2={d.x} y2={d.y}
                        stroke={edge.isBlocked ? "#ef4444" : isPath ? "var(--color-primary)" : "#cbd5e1"}
                        strokeWidth={isPath ? 6 : edge.trafficMultiplier > 1 ? 4 : 2}
                        strokeDasharray={edge.isBlocked ? "4,4" : "0"}
                        className="transition-all duration-500"
                        opacity={isPath ? 1 : 0.4}
                      />
                      {/* Interaction Area for Edges */}
                      <circle
                        cx={(s.x + d.x) / 2} cy={(s.y + d.y) / 2}
                        r="12" fill="white" className="cursor-pointer shadow-sm stroke-slate-200"
                        onClick={() => toggleBlock(edge.source, edge.destination)}
                      />
                      <text
                        x={(s.x + d.x) / 2} y={(s.y + d.y) / 2}
                        textAnchor="middle" dy=".3em" fontSize="10" fontWeight="bold"
                        className="pointer-events-none fill-slate-500"
                      >
                        {edge.isBlocked ? "X" : edge.trafficMultiplier}
                      </text>
                      
                      {/* Traffic Controls */}
                      {!edge.isBlocked && (
                        <g transform={`translate(${(s.x + d.x) / 2}, ${(s.y + d.y) / 2 + 18})`}>
                          <circle cx="-10" cy="0" r="6" fill="#1e293b" className="cursor-pointer" onClick={() => adjustTraffic(edge.source, edge.destination, -1)} />
                          <circle cx="10" cy="0" r="6" fill="#1e293b" className="cursor-pointer" onClick={() => adjustTraffic(edge.source, edge.destination, 1)} />
                          <text x="-10" y="0" textAnchor="middle" dy=".3em" fontSize="8" fill="white" className="pointer-events-none">-</text>
                          <text x="10" y="0" textAnchor="middle" dy=".3em" fontSize="8" fill="white" className="pointer-events-none">+</text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isSource = source === node.id;
                  const isDest = dest === node.id;
                  const isPath = result?.path.some(n => n.id === node.id);

                  return (
                    <g key={node.id} className="cursor-pointer">
                      <motion.circle
                        cx={node.x} cy={node.y} r="18"
                        fill={isSource ? "var(--color-emergency)" : isDest ? "#22c55e" : isPath ? "var(--color-primary)" : "white"}
                        stroke={isSource || isDest || isPath ? "none" : "#cbd5e1"}
                        strokeWidth="2"
                        whileHover={{ scale: 1.2 }}
                        className="shadow-xl"
                      />
                      <text
                        x={node.x} y={node.y + 35}
                        textAnchor="middle" fontSize="12" fontWeight="bold"
                        className="fill-foreground/80"
                      >
                        {node.name}
                      </text>
                      {isSource && (
                        <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                           <Truck className="w-6 h-6 text-white" x={node.x - 12} y={node.y - 12} />
                        </motion.g>
                      )}
                      {isDest && (
                        <CheckCircle2 className="w-5 h-5 text-white" x={node.x - 10} y={node.y - 10} />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Legend/Help */}
            <div className="mt-8 flex flex-wrap gap-6 items-center justify-center text-xs text-foreground/50 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emergency" /> Start Station
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Destination
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" /> Calculated Route
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-border bg-white text-[10px] flex items-center justify-center font-bold">X</div> Block/Unblock
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">+/-</div> Adjust Traffic
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
