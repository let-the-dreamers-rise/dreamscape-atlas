import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, X } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { mockDreams, mockSymbols } from "@/lib/dreamData";

// Build nodes from symbols
const symbolPositions: Record<string, { x: number; y: number }> = {
  Flying: { x: 0, y: 0 },
  Ocean: { x: 250, y: 100 },
  City: { x: 450, y: -50 },
  Forest: { x: -200, y: 200 },
  School: { x: 100, y: 350 },
  Running: { x: -300, y: -100 },
  Light: { x: 200, y: -200 },
  Mountain: { x: 500, y: 200 },
  Mirror: { x: -150, y: -250 },
  Rain: { x: 350, y: 300 },
  Door: { x: -50, y: 150 },
  Stars: { x: -350, y: 100 },
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
  position: symbolPositions[s.name] || { x: Math.random() * 400, y: Math.random() * 400 },
  data: { label: s.name, frequency: s.frequency },
  type: "default",
  style: {
    background: `${colorMap[s.name] || "#a78bfa"}22`,
    border: `2px solid ${colorMap[s.name] || "#a78bfa"}`,
    borderRadius: "50%",
    width: 40 + s.frequency * 6,
    height: 40 + s.frequency * 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: colorMap[s.name] || "#a78bfa",
    boxShadow: `0 0 20px ${colorMap[s.name] || "#a78bfa"}33`,
  },
}));

// Build edges: connect symbols that co-occur in dreams
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
            style: { stroke: "#a78bfa44", strokeWidth: 1.5 },
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
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 z-10 p-6 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-dream-violet/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-dream-violet" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Subconscious Atlas</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">Click a symbol to explore connections.</p>
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
        <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="#ffffff08" />
        <Controls className="!bg-card !border-border !shadow-none [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-secondary" />
      </ReactFlow>

      {/* Side panel */}
      <AnimatePresence>
        {selectedSymbol && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            className="absolute top-0 right-0 h-full w-80 border-l border-border bg-card/95 backdrop-blur-xl z-20 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-foreground">{selectedSymbol.name}</h2>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="dream-card p-4 mb-6">
                <p className="text-sm text-muted-foreground">Appearances</p>
                <p className="text-2xl font-display font-bold text-foreground">{selectedSymbol.frequency}</p>
              </div>

              <h3 className="text-sm font-display font-semibold text-foreground mb-3">Related Dreams</h3>
              <div className="space-y-3">
                {relatedDreams.map((dream) => (
                  <a key={dream.id} href={`/dream/${dream.id}`} className="dream-card-hover p-3 block group">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{dream.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-dream-dim">{dream.date}</span>
                      <span className="dream-tag text-xs">{dream.emotion}</span>
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
