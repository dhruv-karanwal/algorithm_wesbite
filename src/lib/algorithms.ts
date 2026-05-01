export interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
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
}

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
