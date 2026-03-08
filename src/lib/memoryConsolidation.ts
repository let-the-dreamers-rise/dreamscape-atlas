import { Dream } from "./types";

export interface MemoryCluster {
  id: string;
  name: string;
  symbols: string[];
  dreamIds: string[];
  strength: number; // 0-1, based on how many dreams share these symbols
  description: string;
  color: string;
}

const clusterColors = [
  "hsl(265 80% 65%)",   // violet
  "hsl(195 90% 60%)",   // cyan
  "hsl(340 70% 65%)",   // rose
  "hsl(35 90% 60%)",    // amber
  "hsl(160 70% 50%)",   // emerald
  "hsl(280 70% 70%)",   // purple
  "hsl(220 80% 60%)",   // blue
];

const clusterNameTemplates = [
  "Exploration",
  "Transformation",
  "Ascension",
  "Dissolution",
  "Emergence",
  "Convergence",
  "Resonance",
  "Threshold",
  "Projection",
  "Integration",
];

/**
 * Hippocampal-Inspired Memory Consolidation Algorithm
 * 
 * Models the brain's hippocampal consolidation process:
 * 1. During sleep, the hippocampus replays recent experiences
 * 2. Shared neural patterns across experiences get strengthened
 * 3. Overlapping memories consolidate into unified representations
 * 
 * Here we detect symbol co-occurrence patterns across dreams,
 * finding groups of symbols that repeatedly appear together —
 * forming "memory clusters" analogous to consolidated memories.
 */
export function computeMemoryClusters(dreams: Dream[]): MemoryCluster[] {
  if (dreams.length < 2) return [];

  // Step 1: Build symbol co-occurrence matrix
  const coOccurrence = new Map<string, Map<string, number>>();
  const symbolDreams = new Map<string, Set<string>>();

  for (const dream of dreams) {
    for (const sym of dream.symbols) {
      if (!symbolDreams.has(sym)) symbolDreams.set(sym, new Set());
      symbolDreams.get(sym)!.add(dream.id);

      for (const other of dream.symbols) {
        if (sym === other) continue;
        if (!coOccurrence.has(sym)) coOccurrence.set(sym, new Map());
        const current = coOccurrence.get(sym)!.get(other) || 0;
        coOccurrence.get(sym)!.set(other, current + 1);
      }
    }
  }

  // Step 2: Find strongly connected symbol groups (simplified graph clustering)
  const visited = new Set<string>();
  const clusters: { symbols: Set<string>; dreamIds: Set<string> }[] = [];

  const allSymbols = Array.from(symbolDreams.keys());

  for (const startSymbol of allSymbols) {
    if (visited.has(startSymbol)) continue;
    if ((symbolDreams.get(startSymbol)?.size || 0) < 2) continue;

    // BFS to find connected symbols with co-occurrence >= 2
    const clusterSymbols = new Set<string>();
    const queue = [startSymbol];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (clusterSymbols.has(current)) continue;
      clusterSymbols.add(current);
      visited.add(current);

      const neighbors = coOccurrence.get(current);
      if (neighbors) {
        for (const [neighbor, count] of neighbors) {
          if (!clusterSymbols.has(neighbor) && count >= 2) {
            queue.push(neighbor);
          }
        }
      }
    }

    if (clusterSymbols.size >= 2) {
      const clusterDreamIds = new Set<string>();
      for (const sym of clusterSymbols) {
        const dIds = symbolDreams.get(sym);
        if (dIds) dIds.forEach((id) => clusterDreamIds.add(id));
      }
      clusters.push({ symbols: clusterSymbols, dreamIds: clusterDreamIds });
    }
  }

  // Step 3: Score and name clusters
  return clusters
    .map((cluster, i) => {
      const syms = Array.from(cluster.symbols);
      const dreamCount = cluster.dreamIds.size;
      const totalDreams = dreams.length;
      
      // Strength = how consolidated this memory is (based on repetition + interconnection)
      const strength = Math.min(1, (dreamCount / totalDreams) * (syms.length / 3));
      
      const templateName = clusterNameTemplates[i % clusterNameTemplates.length];
      const topSymbols = syms.slice(0, 3).join(" / ");

      return {
        id: `cluster-${i}`,
        name: `${templateName} Memory`,
        symbols: syms,
        dreamIds: Array.from(cluster.dreamIds),
        strength,
        description: `Consolidated from ${dreamCount} dreams sharing ${topSymbols}. Strength: ${Math.round(strength * 100)}% — ${strength > 0.6 ? "deeply encoded" : strength > 0.3 ? "forming connections" : "emerging pattern"}.`,
        color: clusterColors[i % clusterColors.length],
      };
    })
    .sort((a, b) => b.strength - a.strength);
}

/**
 * Get consolidation stage label for a cluster
 */
export function getConsolidationStage(strength: number): { label: string; description: string } {
  if (strength >= 0.7) return { label: "Deep Memory", description: "Fully consolidated — this pattern is deeply encoded in your subconscious" };
  if (strength >= 0.5) return { label: "Consolidating", description: "Active consolidation — the hippocampus is replaying and strengthening these connections" };
  if (strength >= 0.3) return { label: "Encoding", description: "Initial encoding — neural pathways are forming between these dream elements" };
  return { label: "Emerging", description: "Nascent pattern — detected but not yet consolidated into long-term memory" };
}
