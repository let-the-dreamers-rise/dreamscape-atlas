import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, ArrowRight, Layers, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useDreams, useSymbols } from "@/hooks/useDreams";
import { useConsent } from "@/hooks/useConsent";
import { computeMemoryClusters, getConsolidationStage } from "@/lib/memoryConsolidation";
import GlowOrb from "@/components/GlowOrb";

const MemoryClusters = () => {
  const { allDreams, loading } = useDreams();
  const { consent } = useConsent();
  const clusters = consent.clusterFormation ? computeMemoryClusters(allDreams) : [];

  const isEmpty = !loading && clusters.length === 0;
  const consentBlocked = !consent.clusterFormation;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise">
      <GlowOrb color="primary" size={500} className="-top-40 left-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 right-10" delay={3} />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--dream-accent-cyan) / 0.25), hsl(var(--primary) / 0.15))",
                  border: "1px solid hsl(var(--dream-accent-cyan) / 0.4)",
                  boxShadow: "0 0 20px hsl(var(--dream-accent-cyan) / 0.15)",
                }}
              >
                <Brain className="w-3.5 h-3.5 text-[hsl(var(--dream-accent-cyan))]" />
              </div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "hsl(var(--dream-accent-cyan) / 0.8)" }}>
                Hippocampal Engine
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-[-0.02em] text-foreground mb-4 leading-[0.95]">
              Memory<br />
              <span className="dream-text-gradient">Consolidation</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Modeled on hippocampal memory consolidation — your brain replays dreams during sleep, 
              strengthening shared patterns into unified memory clusters. This engine detects those patterns.
            </p>
          </div>

          {/* Science Explainer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 p-6 rounded-2xl dream-glass-strong relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dream-accent-cyan) / 0.4), transparent)" }} />
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: "hsl(var(--dream-accent-amber))" }} />
              <span className="text-xs font-display font-bold text-foreground">How It Works</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Replay", desc: "Dreams are scanned for recurring symbol co-occurrences, mimicking hippocampal replay during sleep." },
                { step: "02", title: "Strengthen", desc: "Symbols appearing together across multiple dreams form stronger associative bonds — like synaptic potentiation." },
                { step: "03", title: "Consolidate", desc: "Clusters emerge as unified memory representations, encoded with a consolidation strength score." },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "hsl(var(--dream-accent-cyan))" }}>{item.step}</span>
                  <h3 className="font-display font-bold text-sm text-foreground mt-1">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Clusters */}
          {consentBlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "hsl(var(--dream-accent-rose) / 0.1)", border: "1px solid hsl(var(--dream-accent-rose) / 0.2)" }}>
                <Shield className="w-7 h-7 opacity-60" style={{ color: "hsl(var(--dream-accent-rose))" }} />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">Consolidation Disabled</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
                Memory cluster formation is currently blocked by your consent settings.
              </p>
              <Link to="/sovereignty" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm text-primary-foreground transition-all duration-300 dream-glow-strong" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}>
                <Shield className="w-4 h-4" />
                Manage Consent
              </Link>
            </motion.div>
          ) : isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-20"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "hsl(var(--dream-accent-cyan) / 0.1)",
                  border: "1px solid hsl(var(--dream-accent-cyan) / 0.2)",
                }}
              >
                <Layers className="w-7 h-7 opacity-60" style={{ color: "hsl(var(--dream-accent-cyan))" }} />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">No clusters yet</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
                Record more dreams to allow the consolidation engine to detect recurring patterns and form memory clusters.
              </p>
              <Link
                to="/capture"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm text-primary-foreground transition-all duration-300 dream-glow-strong"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
              >
                Record Dreams
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  {clusters.length} Memory Cluster{clusters.length !== 1 ? "s" : ""} Detected
                </h2>
              </div>

              <AnimatePresence>
                {clusters.map((cluster, i) => {
                  const stage = getConsolidationStage(cluster.strength);
                  return (
                    <motion.div
                      key={cluster.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="p-6 rounded-2xl dream-glass-strong relative overflow-hidden group"
                    >
                      {/* Glow accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${cluster.color}66, transparent)` }}
                      />
                      <div
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                        style={{ background: cluster.color }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="w-4 h-4" style={{ color: cluster.color }} />
                              <h3 className="font-display font-bold text-lg text-foreground">{cluster.name}</h3>
                            </div>
                            <span
                              className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                              style={{
                                background: `${cluster.color}15`,
                                color: cluster.color,
                                border: `1px solid ${cluster.color}30`,
                              }}
                            >
                              {stage.label}
                            </span>
                          </div>

                          {/* Strength Ring */}
                          <div className="relative w-16 h-16">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle
                                cx="18" cy="18" r="14"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                              />
                              <circle
                                cx="18" cy="18" r="14"
                                fill="none"
                                stroke={cluster.color}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${cluster.strength * 88} 88`}
                                className="neural-pulse"
                              />
                            </svg>
                            <span
                              className="absolute inset-0 flex items-center justify-center text-xs font-display font-bold"
                              style={{ color: cluster.color }}
                            >
                              {Math.round(cluster.strength * 100)}%
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{cluster.description}</p>

                        {/* Symbols */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cluster.symbols.map((sym) => (
                            <span
                              key={sym}
                              className="px-3 py-1 text-[11px] font-medium rounded-full"
                              style={{
                                background: `${cluster.color}10`,
                                border: `1px solid ${cluster.color}25`,
                                color: cluster.color,
                              }}
                            >
                              {sym}
                            </span>
                          ))}
                        </div>

                        {/* Dream count */}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Layers className="w-3 h-3" />
                          <span>{cluster.dreamIds.length} dreams contributing to this cluster</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MemoryClusters;
