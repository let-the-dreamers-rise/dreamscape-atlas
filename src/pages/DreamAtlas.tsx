import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, X, ArrowRight, PenLine, Brain, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDreams, useSymbols } from "@/hooks/useDreams";
import { Dream, Symbol as DreamSymbol } from "@/lib/types";
import { computeMemoryClusters, getConsolidationStage } from "@/lib/memoryConsolidation";
import GlowOrb from "@/components/GlowOrb";

const colorPalette = [
  "#a78bfa", "#38bdf8", "#c084fc", "#34d399", "#fbbf24",
  "#fb923c", "#facc15", "#94a3b8", "#e879f9", "#60a5fa",
  "#f472b6", "#818cf8", "#2dd4bf", "#f87171", "#a3e635",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

function buildGraph(symbols: DreamSymbol[], dreams: Dream[]) {
  const clusters = computeMemoryClusters(dreams);
  
  // Position symbols in a radial layout
  const nodes: Node[] = symbols.map((s, i) => {
    const angle = (2 * Math.PI * i) / symbols.length;
    const radius = 200 + s.frequency * 15;
    const color = getColor(s.name);
    const nodeSize = Math.max(60, 40 + s.frequency * 8 + s.name.length * 3);
    return {
      id: s.id,
      type: "default",
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      data: { label: s.name, nodeType: "symbol" },
      style: {
        background: `${color}18`,
        border: `1.5px solid ${color}55`,
        borderRadius: "50%",
        width: nodeSize,
        height: nodeSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: s.name.length > 12 ? "9px" : "11px",
        fontWeight: 700,
        fontFamily: '"Space Grotesk", sans-serif',
        color,
        boxShadow: `0 0 35px ${color}25, inset 0 0 25px ${color}0a`,
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        padding: "4px",
        textAlign: "center" as const,
        wordBreak: "break-word" as const,
        overflow: "hidden",
      },
    };
  });

  // Add cluster nodes as larger "hub" nodes
  const symbolNameToId: Record<string, string> = {};
  symbols.forEach((s) => { symbolNameToId[s.name] = s.id; });

  clusters.forEach((cluster, ci) => {
    const clusterSymIds = cluster.symbols.map((s) => symbolNameToId[s]).filter(Boolean);
    if (clusterSymIds.length === 0) return;

    // Position cluster at centroid of its symbols
    const memberNodes = nodes.filter((n) => clusterSymIds.includes(n.id));
    const cx = memberNodes.reduce((sum, n) => sum + n.position.x, 0) / memberNodes.length;
    const cy = memberNodes.reduce((sum, n) => sum + n.position.y, 0) / memberNodes.length;
    const size = 60 + cluster.strength * 40;

    nodes.push({
      id: `cluster-${ci}`,
      type: "default",
      position: { x: cx, y: cy },
      data: { label: `⬡ ${cluster.name}`, nodeType: "cluster", cluster },
      style: {
        background: `${cluster.color}12`,
        border: `2px solid ${cluster.color}40`,
        borderRadius: "16px",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 800,
        fontFamily: '"Space Grotesk", sans-serif',
        color: cluster.color,
        boxShadow: `0 0 50px ${cluster.color}20, 0 0 100px ${cluster.color}08`,
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        zIndex: 10,
      },
    });
  });

  // Build edges from co-occurrence
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];

  for (const dream of dreams) {
    const syms = dream.symbols;
    for (let i = 0; i < syms.length; i++) {
      for (let j = i + 1; j < syms.length; j++) {
        const aId = symbolNameToId[syms[i]];
        const bId = symbolNameToId[syms[j]];
        if (aId && bId) {
          const key = [aId, bId].sort().join("-");
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            const color = getColor(syms[i]);
            edges.push({
              id: key,
              source: aId,
              target: bId,
              style: { stroke: `${color}25`, strokeWidth: 1.5 },
              animated: true,
            });
          }
        }
      }
    }
  }

  // Add cluster-to-symbol edges
  clusters.forEach((cluster, ci) => {
    cluster.symbols.forEach((symName) => {
      const symId = symbolNameToId[symName];
      if (symId) {
        edges.push({
          id: `cluster-${ci}-${symId}`,
          source: `cluster-${ci}`,
          target: symId,
          style: { stroke: `${cluster.color}35`, strokeWidth: 2, strokeDasharray: "5 5" },
          animated: true,
        });
      }
    });
  });

  return { nodes, edges };
}

const DreamAtlas = () => {
  const { allDreams, loading } = useDreams();
  const allSymbols = useSymbols(allDreams);
  const clusters = computeMemoryClusters(allDreams);
  const { nodes: graphNodes, edges: graphEdges } = buildGraph(allSymbols, allDreams);

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"symbol" | "cluster">("symbol");

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = buildGraph(allSymbols, allDreams);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [allDreams.length, allSymbols.length, setNodes, setEdges]);

  const selectedSymbol = selectedType === "symbol" && selected ? allSymbols.find((s) => s.id === selected) : null;
  const selectedCluster = selectedType === "cluster" && selected ? clusters.find((_, i) => `cluster-${i}` === selected) : null;
  const relatedDreams = selectedSymbol
    ? allDreams.filter((d) => d.symbols.includes(selectedSymbol.name))
    : selectedCluster
    ? allDreams.filter((d) => selectedCluster.dreamIds.includes(d.id))
    : [];

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.id.startsWith("cluster-")) {
      setSelectedType("cluster");
    } else {
      setSelectedType("symbol");
    }
    setSelected(node.id);
  }, []);

  const isEmpty = !loading && allDreams.length === 0;

  return (
    <div className="h-[calc(100vh-4rem)] relative dream-noise">
      <GlowOrb color="primary" size={400} className="-top-40 left-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 right-10" delay={2} />

      <div className="absolute top-0 left-0 z-10 p-6 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center pointer-events-auto"
              style={{
                background: "linear-gradient(135deg, hsl(280 70% 70% / 0.25), hsl(265 80% 65% / 0.15))",
                border: "1px solid hsl(280 70% 70% / 0.4)",
                boxShadow: "0 0 20px hsl(280 70% 70% / 0.15)",
              }}
            >
              <Map className="w-3.5 h-3.5 text-dream-violet" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-dream-violet/80">Neural Map</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Subconscious Atlas</h1>
          <p className="text-[11px] text-muted-foreground mt-1">
            {allSymbols.length} symbols • {clusters.length} memory clusters • {allDreams.length} dreams
          </p>
        </motion.div>
      </div>

      {isEmpty ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm px-6">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}
            >
              <Map className="w-7 h-7 text-primary opacity-60" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Your atlas is empty</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Record your first dream to start building your neural map. Each dream adds symbols and connections.
            </p>
            <Link
              to="/capture"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm text-primary-foreground transition-all duration-300 dream-glow-strong"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
            >
              <PenLine className="w-4 h-4" />
              Record a Dream
            </Link>
          </motion.div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent"
        >
          <Background variant={BackgroundVariant.Dots} gap={40} size={0.8} color="rgba(168,139,250,0.05)" />
        </ReactFlow>
      )}

      <AnimatePresence>
        {(selectedSymbol || selectedCluster) && (
          <motion.div
            initial={{ x: 350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 350, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            className="absolute top-0 right-0 h-full w-80 z-20 overflow-y-auto dream-glass-strong"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-semibold">
                    {selectedCluster ? "Memory Cluster" : "Symbol"}
                  </span>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {selectedCluster?.name || selectedSymbol?.name}
                  </h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg dream-glass hover:bg-muted transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {selectedCluster && (
                <>
                  <div className="dream-glass-strong rounded-xl p-5 mb-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${selectedCluster.color}40, transparent)` }} />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold mb-1">Consolidation</p>
                        <p className="text-3xl font-display font-bold" style={{ color: selectedCluster.color }}>
                          {Math.round(selectedCluster.strength * 100)}%
                        </p>
                      </div>
                      <Brain className="w-8 h-8 neural-pulse" style={{ color: selectedCluster.color }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {getConsolidationStage(selectedCluster.strength).description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedCluster.symbols.map((sym) => (
                      <span
                        key={sym}
                        className="px-2.5 py-1 text-[10px] font-medium rounded-full"
                        style={{
                          background: `${selectedCluster.color}10`,
                          border: `1px solid ${selectedCluster.color}25`,
                          color: selectedCluster.color,
                        }}
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {selectedSymbol && (
                <div className="dream-glass-strong rounded-xl p-5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold mb-1">Appearances</p>
                  <p className="text-4xl font-display font-bold dream-text-gradient">{selectedSymbol.frequency}</p>
                </div>
              )}

              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Related Dreams</h3>
              <div className="space-y-2">
                {relatedDreams.map((dream) => (
                  <a key={dream.id} href={`/dream/${dream.id}`} className="group block p-3.5 rounded-xl dream-card-hover">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">{dream.title}</p>
                      <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-dream-dim">{dream.date}</span>
                      <span className="dream-tag text-[10px]">{dream.emotion}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DreamAtlas;
