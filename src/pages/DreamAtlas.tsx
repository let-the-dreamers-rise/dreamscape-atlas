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
import { mockDreams, mockSymbols } from "@/lib/dreamData";
import GlowOrb from "@/components/GlowOrb";

const symbolPositions: Record<string, { x: number; y: number }> = {
  Flying: { x: 0, y: 0 },
  Ocean: { x: 300, y: 120 },
  City: { x: 550, y: -80 },
  Forest: { x: -250, y: 250 },
  School: { x: 120, y: 400 },
  Running: { x: -380, y: -120 },
  Light: { x: 250, y: -250 },
  Mountain: { x: 600, y: 250 },
  Mirror: { x: -200, y: -300 },
  Rain: { x: 400, y: 350 },
  Door: { x: -60, y: 180 },
  Stars: { x: -420, y: 130 },
};

const colorMap: Record<string, string> = {
  Flying: "#a78bfa",
  Ocean: "#38bdf8",
  City: "#c084fc",
  Forest: "#34d399",
  School: "#fbbf24",
  Running: "#fb923c",
  Light: "#facc15",
  Mountain: "#94a3b8",
  Mirror: "#e879f9",
  Rain: "#60a5fa",
  Door: "#f472b6",
  Stars: "#818cf8",
};

const initialNodes: Node[] = mockSymbols.map((s) => ({
  id: s.id,
  position: symbolPositions[s.name] || { x: Math.random() * 500, y: Math.random() * 500 },
  data: { label: s.name },
  style: {
    background: `${colorMap[s.name] || "#a78bfa"}18`,
    border: `1.5px solid ${colorMap[s.name] || "#a78bfa"}55`,
    borderRadius: "50%",
    width: 40 + s.frequency * 5,
    height: 40 + s.frequency * 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: '"Space Grotesk", sans-serif',
    color: colorMap[s.name] || "#a78bfa",
    boxShadow: `0 0 35px ${colorMap[s.name] || "#a78bfa"}25, inset 0 0 25px ${colorMap[s.name] || "#a78bfa"}0a`,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
}));

const edgeSet = new Set<string>();
const initialEdges: Edge[] = [];
mockDreams.forEach((dream) => {
  const syms = dream.symbols;
  for (let i = 0; i < syms.length; i++) {
    for (let j = i + 1; j < syms.length; j++) {
      const a = mockSymbols.find((s) => s.name === syms[i]);
      const b = mockSymbols.find((s) => s.name === syms[j]);
      if (a && b) {
        const key = [a.id, b.id].sort().join("-");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          initialEdges.push({
            id: key,
            source: a.id,
            target: b.id,
            style: { stroke: `${colorMap[syms[i]] || "#a78bfa"}25`, strokeWidth: 1.5 },
            animated: true,
          });
        }
      }
    }
  }
});

const DreamAtlas = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedSymbol = selected ? mockSymbols.find((s) => s.id === selected) : null;
  const relatedDreams = selectedSymbol
    ? mockDreams.filter((d) => d.symbols.includes(selectedSymbol.name))
    : [];

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelected(node.id);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] relative dream-noise">
      <GlowOrb color="primary" size={400} className="-top-40 left-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 right-10" delay={2} />

      {/* Header */}
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
          <p className="text-[11px] text-muted-foreground mt-1">Click a symbol node to explore its connections.</p>
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

      {/* Side Panel */}
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
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg dream-glass hover:bg-muted transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Frequency */}
              <div className="dream-glass-strong rounded-xl p-5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold mb-1">Appearances</p>
                <p className="text-4xl font-display font-bold dream-text-gradient">{selectedSymbol.frequency}</p>
              </div>

              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Related Dreams</h3>
              <div className="space-y-2">
                {relatedDreams.map((dream) => (
                  <a
                    key={dream.id}
                    href={`/dream/${dream.id}`}
                    className="group block p-3.5 rounded-xl dream-card-hover"
                  >
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
