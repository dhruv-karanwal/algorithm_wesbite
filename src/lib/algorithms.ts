export type NodeType = "station" | "hospital" | "clinic";
export type Capability = "cardiac" | "trauma" | "icu" | "general";

export interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  type?: NodeType;
  capabilities?: Capability[];
  availability?: number; // 0 to 1
}

export interface Edge {
  source: string; // node id
  destination: string; // node id
  weight: number;
  trafficMultiplier: number;
  isBlocked: boolean;
}

export interface AlgorithmResult {
  algorithmName: string;
  path: Node[];
  totalWeight: number;
  nodesVisited: number;
  executionTime: number; // in ms
  explanation?: string;
}

export const calculateScore = (
  distance: number,
  traffic: number,
  capabilityMatch: boolean,
  availability: number,
  weights = { dist: 0.4, traffic: 0.3, cap: 0.2, avail: 0.1 }
) => {
  // Lower score is better (cost)
  const capBonus = capabilityMatch ? 0 : 50; // Penalty for no match
  const availPenalty = (1 - availability) * 30;
  return (distance * weights.dist) + (traffic * weights.traffic) + capBonus + availPenalty;
};

class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export const dijkstra = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const pq = new PriorityQueue<string>();
  let nodesVisited = 0;

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[startId] = 0;
  pq.enqueue(startId, 0);

  while (!pq.isEmpty()) {
    const currentId = pq.dequeue()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    nodesVisited++;

    if (currentId === endId) break;

    const neighbors = edges.filter((e) => e.source === currentId && !e.isBlocked);
    for (const edge of neighbors) {
      const neighborId = edge.destination;
      const weight = edge.weight * edge.trafficMultiplier;
      const alt = distances[currentId] + weight;

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
        pq.enqueue(neighborId, alt);
      }
    }
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    currId = previous[currId];
  }

  return {
    algorithmName: "Dijkstra",
    path: path[0]?.id === startId ? path : [],
    totalWeight: distances[endId],
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const aStar = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const endNode = nodes.find((n) => n.id === endId)!;
  const heuristic = (node: Node) => {
    return Math.sqrt(Math.pow(node.x - endNode.x, 2) + Math.pow(node.y - endNode.y, 2));
  };

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();
  let nodesVisited = 0;

  nodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    previous[node.id] = null;
  });

  const startNode = nodes.find((n) => n.id === startId)!;
  gScore[startId] = 0;
  fScore[startId] = heuristic(startNode);
  pq.enqueue(startId, fScore[startId]);

  while (!pq.isEmpty()) {
    const currentId = pq.dequeue()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    nodesVisited++;

    if (currentId === endId) break;

    const neighbors = edges.filter((e) => e.source === currentId && !e.isBlocked);
    for (const edge of neighbors) {
      const neighborId = edge.destination;
      const neighborNode = nodes.find((n) => n.id === neighborId)!;
      const weight = edge.weight * edge.trafficMultiplier;
      const tentativeGScore = gScore[currentId] + weight;

      if (tentativeGScore < gScore[neighborId]) {
        previous[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = gScore[neighborId] + heuristic(neighborNode);
        pq.enqueue(neighborId, fScore[neighborId]);
      }
    }
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    currId = previous[currId];
  }

  return {
    algorithmName: "A*",
    path: path[0]?.id === startId ? path : [],
    totalWeight: gScore[endId],
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const bfs = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const previous: Record<string, string | null> = { [startId]: null };
  let nodesVisited = 0;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    nodesVisited++;
    if (currentId === endId) break;

    const neighbors = edges
      .filter((e) => e.source === currentId && !e.isBlocked)
      .map((e) => e.destination);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        previous[neighborId] = currentId;
        queue.push(neighborId);
      }
    }
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  let totalWeight = 0;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    const nextId = previous[currId];
    if (nextId) {
        const edge = edges.find(e => e.source === nextId && e.destination === currId);
        if (edge) totalWeight += edge.weight * edge.trafficMultiplier;
    }
    currId = nextId;
  }

  return {
    algorithmName: "BFS",
    path: path[0]?.id === startId ? path : [],
    totalWeight,
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const dfs = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const stack: string[] = [startId];
  const visited = new Set<string>();
  const previous: Record<string, string | null> = { [startId]: null };
  let nodesVisited = 0;

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    nodesVisited++;
    if (currentId === endId) break;

    const neighbors = edges
      .filter((e) => e.source === currentId && !e.isBlocked)
      .map((e) => e.destination);

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        previous[neighborId] = currentId;
        stack.push(neighborId);
      }
    }
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  let totalWeight = 0;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    const nextId = previous[currId];
    if (nextId) {
        const edge = edges.find(e => e.source === nextId && e.destination === currId);
        if (edge) totalWeight += edge.weight * edge.trafficMultiplier;
    }
    currId = nextId;
  }

  return {
    algorithmName: "DFS",
    path: path[0]?.id === startId ? path : [],
    totalWeight,
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const greedy = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const endNode = nodes.find((n) => n.id === endId)!;
  const heuristic = (node: Node) => {
    return Math.sqrt(Math.pow(node.x - endNode.x, 2) + Math.pow(node.y - endNode.y, 2));
  };

  const pq = new PriorityQueue<string>();
  const previous: Record<string, string | null> = { [startId]: null };
  const visited = new Set<string>();
  let nodesVisited = 0;

  const startNode = nodes.find((n) => n.id === startId)!;
  pq.enqueue(startId, heuristic(startNode));

  while (!pq.isEmpty()) {
    const currentId = pq.dequeue()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    nodesVisited++;

    if (currentId === endId) break;

    const neighbors = edges.filter((e) => e.source === currentId && !e.isBlocked);
    for (const edge of neighbors) {
      const neighborId = edge.destination;
      const neighborNode = nodes.find((n) => n.id === neighborId)!;
      if (!visited.has(neighborId)) {
        previous[neighborId] = currentId;
        pq.enqueue(neighborId, heuristic(neighborNode));
      }
    }
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  let totalWeight = 0;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    const nextId = previous[currId];
    if (nextId) {
        const edge = edges.find(e => e.source === nextId && e.destination === currId);
        if (edge) totalWeight += edge.weight * edge.trafficMultiplier;
    }
    currId = nextId;
  }

  return {
    algorithmName: "Greedy BFS",
    path: path[0]?.id === startId ? path : [],
    totalWeight,
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const bellmanFord = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  let nodesVisited = 0;

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[startId] = 0;

  // Relax edges |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    let changed = false;
    for (const edge of edges) {
      if (edge.isBlocked) continue;
      const weight = edge.weight * edge.trafficMultiplier;
      if (distances[edge.source] !== Infinity && distances[edge.source] + weight < distances[edge.destination]) {
        distances[edge.destination] = distances[edge.source] + weight;
        previous[edge.destination] = edge.source;
        changed = true;
        nodesVisited++;
      }
    }
    if (!changed) break;
  }

  const path: Node[] = [];
  let currId: string | null = endId;
  while (currId) {
    const node = nodes.find((n) => n.id === currId);
    if (node) path.unshift(node);
    currId = previous[currId];
  }

  return {
    algorithmName: "Bellman-Ford",
    path: path[0]?.id === startId ? path : [],
    totalWeight: distances[endId],
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const floydWarshall = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const dist: Record<string, Record<string, number>> = {};
  const next: Record<string, Record<string, string | null>> = {};

  nodes.forEach((u) => {
    dist[u.id] = {};
    next[u.id] = {};
    nodes.forEach((v) => {
      dist[u.id][v.id] = u.id === v.id ? 0 : Infinity;
      next[u.id][v.id] = null;
    });
  });

  edges.forEach((edge) => {
    if (edge.isBlocked) return;
    const weight = edge.weight * edge.trafficMultiplier;
    dist[edge.source][edge.destination] = weight;
    next[edge.source][edge.destination] = edge.destination;
  });

  let nodesVisited = 0;
  for (const k of nodes.map(n => n.id)) {
    for (const i of nodes.map(n => n.id)) {
      for (const j of nodes.map(n => n.id)) {
        nodesVisited++;
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  const path: Node[] = [];
  if (next[startId][endId] !== null) {
    let curr: string | null = startId;
    while (curr !== null) {
      const node = nodes.find(n => n.id === curr);
      if (node) path.push(node);
      if (curr === endId) break;
      curr = next[curr][endId];
    }
  }

  return {
    algorithmName: "Floyd-Warshall",
    path,
    totalWeight: dist[startId][endId],
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};

export const bidirectionalSearch = (
  nodes: Node[],
  edges: Edge[],
  startId: string,
  endId: string
): AlgorithmResult => {
  const startTime = performance.now();
  const qStart: string[] = [startId];
  const qEnd: string[] = [endId];
  const visitedStart: Record<string, string | null> = { [startId]: null };
  const visitedEnd: Record<string, string | null> = { [endId]: null };
  let intersectNodeId: string | null = null;
  let nodesVisited = 0;

  while (qStart.length > 0 && qEnd.length > 0) {
    // Forward step
    const currStart = qStart.shift()!;
    nodesVisited++;
    if (visitedEnd[currStart] !== undefined) {
      intersectNodeId = currStart;
      break;
    }

    const neighborsStart = edges.filter(e => e.source === currStart && !e.isBlocked);
    for (const edge of neighborsStart) {
      if (!(edge.destination in visitedStart)) {
        visitedStart[edge.destination] = currStart;
        qStart.push(edge.destination);
      }
    }

    // Backward step
    const currEnd = qEnd.shift()!;
    nodesVisited++;
    if (visitedStart[currEnd] !== undefined) {
      intersectNodeId = currEnd;
      break;
    }

    const neighborsEnd = edges.filter(e => e.destination === currEnd && !e.isBlocked);
    for (const edge of neighborsEnd) {
      if (!(edge.source in visitedEnd)) {
        visitedEnd[edge.source] = currEnd;
        qEnd.push(edge.source);
      }
    }
  }

  const path: Node[] = [];
  let totalWeight = 0;

  if (intersectNodeId) {
    // Build path from start to intersect
    let curr: string | null = intersectNodeId;
    const pathStart: Node[] = [];
    while (curr) {
      const node = nodes.find(n => n.id === curr);
      if (node) pathStart.unshift(node);
      curr = visitedStart[curr];
    }
    
    // Build path from intersect to end
    curr = visitedEnd[intersectNodeId];
    const pathEnd: Node[] = [];
    while (curr) {
      const node = nodes.find(n => n.id === curr);
      if (node) pathEnd.push(node);
      curr = visitedEnd[curr];
    }
    
    path.push(...pathStart, ...pathEnd);

    // Calculate weight
    for (let i = 0; i < path.length - 1; i++) {
        const edge = edges.find(e => e.source === path[i].id && e.destination === path[i+1].id);
        if (edge) totalWeight += edge.weight * edge.trafficMultiplier;
    }
  }

  return {
    algorithmName: "Bidirectional Search",
    path,
    totalWeight,
    nodesVisited,
    executionTime: performance.now() - startTime,
  };
};
