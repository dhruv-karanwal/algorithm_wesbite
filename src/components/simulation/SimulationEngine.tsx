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
  Truck,
  Info
} from "lucide-react";
import { 
  Node, 
  Edge, 
  AlgorithmResult, 
  dijkstra, 
  aStar, 
  bellmanFord, 
  floydWarshall, 
  bidirectionalSearch, 
  greedy 
} from "@/lib/algorithms";

// Initial City Graph Data
// Initial City Graph Data
const INITIAL_NODES: Node[] = [
  { id: "1", name: "Station A", x: 100, y: 100, type: "station" },
  { id: "2", name: "Hub B", x: 300, y: 100, type: "station" },
  { id: "3", name: "Junction C", x: 500, y: 100, type: "station" },
  { id: "4", name: "Cross D", x: 100, y: 300, type: "station" },
  { id: "5", name: "Center E", x: 300, y: 300, type: "station" },
  { id: "6", name: "Junction F", x: 500, y: 300, type: "station" },
  { id: "7", name: "General Hosp G", x: 100, y: 500, type: "hospital", capabilities: ["trauma", "icu"], availability: 0.8 },
  { id: "8", name: "Cardiac Hub H", x: 300, y: 500, type: "hospital", capabilities: ["cardiac", "icu"], availability: 0.6 },
  { id: "9", name: "Local Clinic I", x: 500, y: 500, type: "clinic", capabilities: ["general"], availability: 0.9 },
];

const INITIAL_EDGES: Edge[] = [
  { source: "1", destination: "2", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "2", destination: "1", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "2", destination: "3", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "3", destination: "2", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "1", destination: "4", weight: 8, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "1", weight: 8, trafficMultiplier: 1, isBlocked: false },
  { source: "2", destination: "5", weight: 15, trafficMultiplier: 2, isBlocked: false },
  { source: "5", destination: "2", weight: 15, trafficMultiplier: 2, isBlocked: false },
  { source: "3", destination: "6", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "6", destination: "3", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "4", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "6", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "6", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "4", destination: "7", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "7", destination: "4", weight: 12, trafficMultiplier: 1, isBlocked: false },
  { source: "5", destination: "8", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "5", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "6", destination: "9", weight: 15, trafficMultiplier: 1, isBlocked: false },
  { source: "9", destination: "6", weight: 15, trafficMultiplier: 1, isBlocked: false },
  { source: "7", destination: "8", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "7", weight: 10, trafficMultiplier: 1, isBlocked: false },
  { source: "8", destination: "9", weight: 12, trafficMultiplier: 1, isBlocked: false },
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
  const [incidentType, setIncidentType] = useState<"heart_attack" | "trauma" | "general">("general");
  const [globalTraffic, setGlobalTraffic] = useState(1);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    setResult(null);
    
    // Simulate thinking delay
    setTimeout(() => {
      let res: AlgorithmResult;
      const nodesCopy = [...nodes];
      const edgesCopy = edges.map(e => ({...e, trafficMultiplier: e.trafficMultiplier * globalTraffic}));

      switch (activeAlgo) {
        case "dijkstra": res = dijkstra(nodesCopy, edgesCopy, source, dest); break;
        case "astar": res = aStar(nodesCopy, edgesCopy, source, dest); break;
        case "bellman": res = bellmanFord(nodesCopy, edgesCopy, source, dest); break;
        case "floyd": res = floydWarshall(nodesCopy, edgesCopy, source, dest); break;
        case "bidirectional": res = bidirectionalSearch(nodesCopy, edgesCopy, source, dest); break;
        case "greedy": res = greedy(nodesCopy, edgesCopy, source, dest); break;
        default: res = dijkstra(nodesCopy, edgesCopy, source, dest);
      }

      // Add explanation logic
      const targetNode = nodes.find(n => n.id === dest);
      if (targetNode) {
        let explanation = `Route found to ${targetNode.name}. `;
        if (incidentType === "heart_attack" && targetNode.capabilities?.includes("cardiac")) {
          explanation += "This facility was prioritized for its specialized Cardiac unit.";
        } else if (incidentType === "trauma" && targetNode.capabilities?.includes("trauma")) {
          explanation += "Optimized for Trauma response capabilities.";
        } else {
          explanation += "Selected based on distance and current traffic levels.";
        }
        res.explanation = explanation;
      }

      setResult(res);
      setIsRunning(false);
    }, 400);
  }, [activeAlgo, source, dest, nodes, edges, globalTraffic, incidentType]);

  // Live recomputation
  React.useEffect(() => {
    runSimulation();
  }, [source, dest, activeAlgo, globalTraffic, incidentType, edges]);

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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "dijkstra", label: "Dijkstra" },
                    { id: "astar", label: "A* Search" },
                    { id: "bellman", label: "Bellman-Ford" },
                    { id: "floyd", label: "Floyd-Warshall" },
                    { id: "bidirectional", label: "Bidirectional" },
                    { id: "greedy", label: "Greedy BFS" }
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setActiveAlgo(a.id)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition-all border ${
                        activeAlgo === a.id 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-slate-800/50 border-slate-700 text-foreground/70 hover:border-slate-500"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Incident Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "general", label: "General" },
                    { id: "heart_attack", label: "Cardiac" },
                    { id: "trauma", label: "Trauma" }
                  ].map((i) => (
                    <button
                      key={i.id}
                      onClick={() => setIncidentType(i.id as any)}
                      className={`px-2 py-2 rounded-xl text-center text-[10px] font-bold uppercase transition-all border ${
                        incidentType === i.id 
                          ? "bg-emergency border-emergency text-white" 
                          : "bg-slate-800/50 border-slate-700 text-foreground/50"
                      }`}
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">Global Traffic</label>
                  <span className="text-xs font-mono text-primary">{globalTraffic}x</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="0.5" 
                  value={globalTraffic}
                  onChange={(e) => setGlobalTraffic(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
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
                  
                  {result.explanation && (
                    <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                      <h5 className="text-[10px] uppercase font-bold text-primary mb-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Decision Explanation
                      </h5>
                      <p className="text-xs text-foreground/70 leading-relaxed italic">
                        "{result.explanation}"
                      </p>
                    </div>
                  )}

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
                  const isHospital = node.type === "hospital";
                  const isClinic = node.type === "clinic";

                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => { if (isSource) return; setDest(node.id); }}>
                      <motion.circle
                        cx={node.x} cy={node.y} r={isHospital ? "22" : "18"}
                        fill={isSource ? "var(--color-emergency)" : isDest ? "#22c55e" : isPath ? "var(--color-primary)" : "white"}
                        stroke={isSource || isDest || isPath ? "none" : "#cbd5e1"}
                        strokeWidth="2"
                        whileHover={{ scale: 1.1 }}
                        className="shadow-xl"
                      />
                      <text
                        x={node.x} y={node.y + 45}
                        textAnchor="middle" fontSize="10" fontWeight="bold"
                        className="fill-foreground/80"
                      >
                        {node.name}
                      </text>
                      {isSource && (
                        <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                           <Truck className="w-6 h-6 text-white" x={node.x - 12} y={node.y - 12} />
                        </motion.g>
                      )}
                      {isHospital && !isSource && !isDest && (
                        <Plus className={`w-5 h-5 ${isPath ? "text-white" : "text-emergency"}`} x={node.x - 10} y={node.y - 10} />
                      )}
                      {isClinic && !isSource && !isDest && (
                        <AlertTriangle className={`w-4 h-4 ${isPath ? "text-white" : "text-blue-500"}`} x={node.x - 8} y={node.y - 8} />
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
