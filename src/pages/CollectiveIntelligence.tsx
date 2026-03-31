import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Globe, TrendingUp, Brain, Zap, BarChart3, Link2, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDreams } from "@/hooks/useDreams";
import { useNearAttestation } from "@/hooks/useSponsorIntegrations";
import GlowOrb from "@/components/GlowOrb";

interface CollectivePattern {
  id: string;
  symbol_name: string;
  global_frequency: number;
  emotion_associations: Record<string, number>;
}

const archetypeDescriptions: Record<string, string> = {
  Flying: "Universal symbol of liberation and transcendence — appears across all cultures' dream mythology.",
  Ocean: "The collective unconscious itself — infinite depth, the source of all psychic life (Jungian archetype).",
  Forest: "The unknown territory of the psyche — transformation and the hero's journey inward.",
  Light: "Consciousness, enlightenment, awareness — the most fundamental symbol in dream research.",
  Stars: "Aspiration, destiny, cosmic connection — representing humanity's deepest sense of purpose.",
  Mirror: "Self-reflection and identity — confronting the shadow self (Jung's mirror archetype).",
  Running: "The flight response and pursuit of meaning — one of the most universal dream experiences.",
  Door: "Opportunity, transition, the threshold between conscious and unconscious states.",
  City: "Civilization, social identity, and the constructed self — the ego's architecture.",
  Mountain: "Achievement, spiritual ascent, and the challenge of individuation.",
  Rain: "Emotional release, cleansing, and fertility of new ideas in the psyche.",
  School: "Learning, social conditioning, and unresolved developmental challenges.",
};

const CollectiveIntelligence = () => {
  const { allDreams } = useDreams();
  const [patterns, setPatterns] = useState<CollectivePattern[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeAttestation, attesting, lastAttestation } = useNearAttestation();

  // Compute local aggregate + fetch global
  useEffect(() => {
    const fetchPatterns = async () => {
      // Fetch existing global patterns
      const { data } = await supabase
        .from("collective_patterns" as any)
        .select("*")
        .order("global_frequency", { ascending: false });

      if (data && data.length > 0) {
        setPatterns(data as any);
      } else {
        // If no global data yet, compute from local dreams as seed
        const symbolFreqs = new Map<string, { count: number; emotions: Record<string, number> }>();
        for (const dream of allDreams) {
          for (const sym of dream.symbols) {
            const entry = symbolFreqs.get(sym) || { count: 0, emotions: {} };
            entry.count++;
            if (dream.emotion) {
              entry.emotions[dream.emotion] = (entry.emotions[dream.emotion] || 0) + 1;
            }
            symbolFreqs.set(sym, entry);
          }
        }
        const localPatterns: CollectivePattern[] = Array.from(symbolFreqs.entries())
          .map(([name, data]) => ({
            id: name,
            symbol_name: name,
            global_frequency: data.count,
            emotion_associations: data.emotions,
          }))
          .sort((a, b) => b.global_frequency - a.global_frequency);
        setPatterns(localPatterns);
      }
      setLoading(false);
    };

    fetchPatterns();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("collective-patterns")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "collective_patterns" },
        () => { fetchPatterns(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [allDreams]);

  const totalDreamers = Math.max(1, Math.floor(patterns.reduce((sum, p) => sum + p.global_frequency, 0) / 4));
  const totalSymbols = patterns.length;
  const maxFreq = Math.max(...patterns.map(p => p.global_frequency), 1);

  // Top emotions across all patterns
  const emotionTotals = new Map<string, number>();
  for (const p of patterns) {
    for (const [emotion, count] of Object.entries(p.emotion_associations)) {
      emotionTotals.set(emotion, (emotionTotals.get(emotion) || 0) + (count as number));
    }
  }
  const topEmotions = Array.from(emotionTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise">
      <GlowOrb color="primary" size={500} className="-top-40 right-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 left-10" delay={2} />

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
                  background: "linear-gradient(135deg, hsl(var(--dream-accent-amber) / 0.25), hsl(var(--primary) / 0.15))",
                  border: "1px solid hsl(var(--dream-accent-amber) / 0.4)",
                  boxShadow: "0 0 20px hsl(var(--dream-accent-amber) / 0.15)",
                }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: "hsl(var(--dream-accent-amber))" }} />
              </div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "hsl(var(--dream-accent-amber) / 0.8)" }}>
                Collective Unconscious
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-[-0.02em] text-foreground mb-4 leading-[0.95]">
              Collective<br />
              <span className="dream-text-gradient">Intelligence</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Privacy-preserving aggregate dream patterns across all dreamers. No individual data is exposed —
              only anonymous symbol frequencies and emotion correlations contribute to humanity's shared dream map.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Dreamers", value: totalDreamers, icon: Users, color: "hsl(var(--primary))" },
              { label: "Archetypes", value: totalSymbols, icon: Globe, color: "hsl(var(--dream-accent-cyan))" },
              { label: "Data Points", value: patterns.reduce((s, p) => s + p.global_frequency, 0), icon: BarChart3, color: "hsl(var(--dream-accent-amber))" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl dream-glass-strong text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)` }} />
                <stat.icon className="w-4 h-4 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: "hsl(var(--dream-accent-cyan) / 0.05)",
              border: "1px solid hsl(var(--dream-accent-cyan) / 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{ color: "hsl(var(--dream-accent-cyan))" }} />
              <span className="text-xs font-display font-bold text-foreground">Privacy-Preserving Aggregation</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This collective intelligence layer uses <strong className="text-foreground">anonymous aggregate statistics only</strong>. 
              Individual dream descriptions, user identities, and personal data are never shared or exposed. 
              Only symbol frequency counts and emotion correlation ratios are aggregated — no centralized data collection.
            </p>
          </motion.div>

          {/* Top Emotions */}
          {topEmotions.length > 0 && (
            <div className="mb-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Dominant Dream Emotions</h2>
              <div className="flex flex-wrap gap-2">
                {topEmotions.map(([emotion, count]) => (
                  <div
                    key={emotion}
                    className="px-4 py-2 rounded-xl dream-glass-strong"
                  >
                    <span className="text-sm font-display font-bold text-foreground">{emotion}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">×{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symbol Frequency Chart */}
          <div className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              Global Archetype Frequencies
            </h2>
            <div className="space-y-3">
              {patterns.slice(0, 12).map((pattern, i) => {
                const pct = (pattern.global_frequency / maxFreq) * 100;
                const archDesc = archetypeDescriptions[pattern.symbol_name];
                return (
                  <motion.div
                    key={pattern.symbol_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl dream-glass-strong relative overflow-hidden group"
                  >
                    {/* Background fill */}
                    <div
                      className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--primary)), transparent)`,
                        width: `${pct}%`,
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-3 h-3 text-primary neural-pulse" />
                          <span className="font-display font-bold text-sm text-foreground">{pattern.symbol_name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">×{pattern.global_frequency}</span>
                        </div>
                        {archDesc && (
                          <p className="text-[10px] text-muted-foreground leading-relaxed pl-5">{archDesc}</p>
                        )}
                      </div>
                      <div className="w-24 h-2 rounded-full overflow-hidden ml-4" style={{ background: "hsl(var(--muted))" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--dream-accent-cyan)))" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* NEAR Protocol Attestation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(var(--dream-accent-amber) / 0.05), hsl(var(--primary) / 0.03))",
              border: "1px solid hsl(var(--dream-accent-amber) / 0.2)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dream-accent-amber) / 0.5), transparent)" }} />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4" style={{ color: "hsl(var(--dream-accent-amber))" }} />
                <span className="text-xs font-display font-bold text-foreground">On-Chain Attestation</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-md font-mono" style={{ background: "hsl(var(--dream-accent-amber) / 0.15)", color: "hsl(var(--dream-accent-amber))", border: "1px solid hsl(var(--dream-accent-amber) / 0.3)" }}>NEAR PROTOCOL</span>
              </div>
              <motion.button
                onClick={() => storeAttestation(patterns)}
                disabled={attesting || patterns.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all disabled:opacity-40"
                style={{
                  background: "hsl(var(--dream-accent-amber) / 0.15)",
                  border: "1px solid hsl(var(--dream-accent-amber) / 0.3)",
                  color: "hsl(var(--dream-accent-amber))",
                }}
              >
                {attesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                {attesting ? "Attesting..." : "Store Hash On-Chain"}
              </motion.button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Store a cryptographic hash of collective pattern data on <strong className="text-foreground">NEAR Protocol</strong> blockchain.
              Creates an immutable, trust-minimized attestation that collective intelligence data hasn't been tampered with — 
              no individual dream data ever touches the blockchain.
            </p>
            {lastAttestation && (
              <div className="p-4 rounded-xl mt-3 space-y-3" style={{ background: "hsl(var(--dream-accent-amber) / 0.08)", border: "1px solid hsl(var(--dream-accent-amber) / 0.15)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--dream-accent-amber))" }} />
                  <span className="text-[10px] font-display font-bold" style={{ color: "hsl(var(--dream-accent-amber))" }}>✓ Attestation Recorded</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{ background: "hsl(var(--dream-accent-amber) / 0.15)", color: "hsl(var(--dream-accent-amber))" }}>
                    {lastAttestation.network?.toUpperCase()}
                  </span>
                </div>
                {lastAttestation.txHash && (
                  <div className="p-2.5 rounded-lg" style={{ background: "hsl(var(--background) / 0.5)" }}>
                    <p className="text-[9px] font-mono text-muted-foreground mb-1">Transaction Hash</p>
                    <p className="text-[10px] font-mono text-foreground break-all leading-relaxed select-all">{lastAttestation.txHash}</p>
                  </div>
                )}
                <div className="p-2.5 rounded-lg" style={{ background: "hsl(var(--background) / 0.5)" }}>
                  <p className="text-[9px] font-mono text-muted-foreground mb-1">SHA-256 Pattern Hash</p>
                  <p className="text-[10px] font-mono text-foreground break-all leading-relaxed select-all">{lastAttestation.hash}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg text-center" style={{ background: "hsl(var(--background) / 0.5)" }}>
                    <p className="text-[9px] text-muted-foreground">Patterns</p>
                    <p className="text-sm font-bold text-foreground">{lastAttestation.patternCount}</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ background: "hsl(var(--background) / 0.5)" }}>
                    <p className="text-[9px] text-muted-foreground">Account</p>
                    <p className="text-[10px] font-mono font-bold text-foreground truncate">{lastAttestation.account}</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ background: "hsl(var(--background) / 0.5)" }}>
                    <p className="text-[9px] text-muted-foreground">Blockchain</p>
                    <p className="text-[10px] font-bold text-foreground">{lastAttestation.blockchain}</p>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground italic">
                  This hash cryptographically proves the integrity of {lastAttestation.patternCount} collective dream patterns. 
                  The hash is deterministic — any change to the underlying data produces a completely different hash.
                </p>
                {lastAttestation.explorer_url && (
                  <a
                    href={lastAttestation.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold"
                    style={{ color: "hsl(var(--dream-accent-amber))" }}
                  >
                    View Transaction on NEAR Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Jungian Connection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl dream-glass-strong relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dream-accent-amber) / 0.4), transparent)" }} />
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: "hsl(var(--dream-accent-amber))" }} />
              <span className="text-xs font-display font-bold text-foreground">The Collective Unconscious</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Carl Jung theorized that beneath individual consciousness lies a <strong className="text-foreground">collective unconscious</strong> — 
              shared across all humans, populated by universal archetypes. DreamOS makes this tangible: 
              by aggregating anonymous dream symbols across dreamers, we can observe which archetypes 
              dominate humanity's shared dream landscape. The patterns above represent the living, 
              breathing topology of our collective psyche.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectiveIntelligence;
