import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, X, ArrowRight } from "lucide-react";
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
  // Position symbols in a radial layout
  const nodes: Node[] = symbols.map((s, i) => {
    const angle = (2 * Math.PI * i) / symbols.length;
    const radius = 200 + s.frequency * 15;
    const color = getColor(s.name);
    return {
      id: s.id,
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      data: { label: s.name },
      style: {
        background: `${color}18`,
        border: `1.5px solid ${color}55`,
        borderRadius: "50%",
        width: 40 + s.frequency * 5,
        height: 40 + s.frequency * 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 700,
        fontFamily: '"Space Grotesk", sans-serif',
        color,
        boxShadow: `0 0 35px ${color}25, inset 0 0 25px ${color}0a`,
        cursor: "pointer",
        backdropFilter: "blur(8px)",
      },
    };
  });

  // Build edges from co-occurrence
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  const symbolNameToId: Record<string, string> = {};
  symbols.forEach((s) => { symbolNameToId[s.name] = s.id; });

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

  return { nodes, edges };
}

const DreamAtlas = () => {
  const { allDreams } = useDreams();
  const allSymbols = useSymbols(allDreams);
  const { nodes: graphNodes, edges: graphEdges } = buildGraph(allSymbols, allDreams);

  const [nodes, , onNodesChange] = useNodesState(graphNodes);
  const [edges, , onEdgesChange] = useEdgesState(graphEdges);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedSymbol = selected ? allSymbols.find((s) => s.id === selected) : null;
  const relatedDreams = selectedSymbol
    ? allDreams.filter((d) => d.symbols.includes(selectedSymbol.name))
    : [];

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelected(node.id);
  }, []);

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
            {allSymbols.length} symbols • {allDreams.length} dreams mapped
          </p>
        </motion.div>
      </div>

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

      <AnimatePresence>
        {selectedSymbol && (
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
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-semibold">Symbol</span>
                  <h2 className="font-display text-xl font-bold text-foreground">{selectedSymbol.name}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg dream-glass hover:bg-muted transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="dream-glass-strong rounded-xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold mb-1">Appearances</p>
                <p className="text-4xl font-display font-bold dream-text-gradient">{selectedSymbol.frequency}</p>
              </div>

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
                      {(dream as any).isUserDream && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">YOU</span>
                      )}
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
