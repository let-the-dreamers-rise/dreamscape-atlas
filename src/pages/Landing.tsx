import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain, Shield, Users, Zap, ArrowRight, Layers, Eye,
  Network, Lock, Download, GitBranch, Cpu
} from "lucide-react";
import GlowOrb from "@/components/GlowOrb";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const Landing = () => {
  return (
    <div className="relative dream-noise">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 dream-aurora opacity-40" />
        <GlowOrb color="primary" size={800} className="-top-80 -left-40" />
        <GlowOrb color="cyan" size={600} className="top-20 right-0" delay={2} />
        <GlowOrb color="violet" size={400} className="bottom-10 left-1/3" delay={4} />

        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-32"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
            <div
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{
                background: "hsl(var(--dream-accent-amber) / 0.15)",
                border: "1px solid hsl(var(--dream-accent-amber) / 0.3)",
                color: "hsl(var(--dream-accent-amber))",
              }}
            >
              PL_Genesis: Frontiers of Collaboration
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-[7rem] font-display font-bold tracking-[-0.04em] leading-[0.85] mb-6"
          >
            <span className="text-foreground">Dream</span>
            <span className="dream-text-gradient">OS</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em]">
              Neuro-Inspired Cognitive Architecture
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A dream operating system that models <strong className="text-foreground">hippocampal memory consolidation</strong>, 
            enforces <strong className="text-foreground">neural data sovereignty</strong>, and builds 
            a <strong className="text-foreground">collective intelligence</strong> layer from human dream patterns — 
            all without centralized data collection.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-bold text-sm transition-all duration-300 dream-glow-strong text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
            >
              <Brain className="w-4 h-4" />
              Try the Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#architecture"
              className="dream-glass inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-bold text-sm text-foreground transition-all duration-300 hover:border-primary/30"
            >
              <Cpu className="w-4 h-4 text-dream-cyan" />
              View Architecture
            </a>
          </motion.div>
        </motion.div>
      </section>

      <div className="dream-divider" />

      {/* ═══════════ THREE PILLARS ═══════════ */}
      <section className="relative py-28 overflow-hidden">
        <GlowOrb color="violet" size={500} className="-right-40 top-0" delay={3} />
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Core Architecture</span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mt-3 tracking-[-0.02em]">
              Three Pillars of<br /><span className="dream-text-gradient">Cognitive Infrastructure</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Hippocampal Consolidation Engine",
                desc: "Models the brain's memory consolidation process. Dreams sharing recurring symbols form associative clusters — like hippocampal replay strengthening neural pathways during sleep. Each cluster has a consolidation strength score reflecting synaptic potentiation.",
                color: "hsl(var(--dream-accent-cyan))",
                tags: ["Memory Architecture", "Symbol Co-occurrence", "Synaptic Strength"],
                track: "Neuro-Inspired Systems",
              },
              {
                icon: Shield,
                title: "Neural Data Sovereignty",
                desc: "A cognitive liberty framework with granular consent controls, full data portability (JSON export), and permanent deletion. Every consent change is logged in an immutable audit trail. Consent toggles enforce actual permissions — revoking AI analysis truly blocks the pipeline.",
                color: "hsl(var(--dream-accent-rose))",
                tags: ["Consent Controls", "Data Portability", "Audit Trail"],
                track: "Safety & Ethics",
              },
              {
                icon: Users,
                title: "Collective Intelligence",
                desc: "Anonymous aggregate dream statistics across all users — shared symbol frequencies, emotion correlations, and archetypal patterns. No individual dream data leaves the user's control. The collective unconscious emerges from privacy-preserving aggregation.",
                color: "hsl(var(--dream-accent-amber))",
                tags: ["Privacy-Preserving", "Swarm Intelligence", "Archetype Detection"],
                track: "Collective Intelligence",
              },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl dream-glass-strong relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}50, transparent)` }} />
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5 blur-3xl group-hover:opacity-15 transition-opacity duration-700"
                  style={{ background: pillar.color }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}25` }}
                  >
                    <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>

                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ background: `${pillar.color}10`, color: pillar.color, border: `1px solid ${pillar.color}25` }}
                  >
                    {pillar.track}
                  </span>

                  <h3 className="font-display font-bold text-lg text-foreground mb-3 mt-2">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">{pillar.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[9px] rounded-full font-medium"
                        style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="dream-divider" />

      {/* ═══════════ ALGORITHM DEEP DIVE ═══════════ */}
      <section id="architecture" className="relative py-28 overflow-hidden">
        <GlowOrb color="primary" size={400} className="-left-40 top-1/4" delay={2} />
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dream-cyan/80">Technical Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 tracking-[-0.02em]">
              Hippocampal Memory<br /><span className="dream-text-gradient">Consolidation Algorithm</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl leading-relaxed">
              During sleep, the hippocampus replays recent experiences, strengthening shared neural 
              patterns across memories. DreamOS models this process computationally:
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Symbol Co-Occurrence Matrix",
                desc: "Build a matrix tracking which dream symbols appear together. Like neurons that fire together wire together (Hebbian learning), symbols co-occurring across dreams form stronger associations.",
                icon: Network,
                color: "hsl(var(--primary))",
                code: "for (dream of dreams) { for (symA of dream.symbols) { for (symB of dream.symbols) { coOccurrence[symA][symB]++ } } }",
              },
              {
                step: "02",
                title: "Graph-Based Clustering (BFS)",
                desc: "Traverse the co-occurrence graph using breadth-first search, connecting symbols with association counts ≥ 2. This mirrors how hippocampal replay groups related experiences into coherent memory representations.",
                icon: GitBranch,
                color: "hsl(var(--dream-accent-cyan))",
                code: "while (queue.length > 0) { current = queue.shift(); neighbors = coOccurrence[current].filter(count >= 2); cluster.add(current, neighbors); }",
              },
              {
                step: "03",
                title: "Consolidation Strength Scoring",
                desc: "Each cluster receives a strength score based on dream coverage and interconnection density — analogous to long-term potentiation (LTP) in neuroscience. Higher strength = more deeply encoded memory.",
                icon: Zap,
                color: "hsl(var(--dream-accent-amber))",
                code: "strength = min(1, (dreamCount / totalDreams) * (symbolCount / 3)); // LTP-inspired scoring",
              },
              {
                step: "04",
                title: "Consolidation Stage Classification",
                desc: "Clusters are classified into cognitive stages: Emerging (nascent pattern), Encoding (pathways forming), Consolidating (active replay), Deep Memory (fully encoded). Maps to neuroscience memory formation stages.",
                icon: Layers,
                color: "hsl(var(--dream-accent-rose))",
                code: "stage = strength >= 0.7 ? 'Deep Memory' : strength >= 0.5 ? 'Consolidating' : strength >= 0.3 ? 'Encoding' : 'Emerging'",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl dream-glass-strong relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="block text-center text-[10px] font-mono font-bold mt-2" style={{ color: item.color }}>{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-base text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                    <div className="p-3 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto" style={{ background: "hsl(var(--muted) / 0.7)", color: "hsl(var(--dream-accent-cyan))" }}>
                      {item.code}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="dream-divider" />

      {/* ═══════════ SOVEREIGNTY FRAMEWORK ═══════════ */}
      <section className="relative py-28 overflow-hidden">
        <GlowOrb color="cyan" size={400} className="right-0 top-1/4" delay={1} />
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dream-rose/80">Cognitive Liberty</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 tracking-[-0.02em]">
              Neural Data Sovereignty<br /><span className="dream-text-gradient-warm">Framework</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Eye,
                title: "Granular Consent Controls",
                desc: "Four independent toggles: AI Analysis, Image Generation, Pattern Detection, Memory Consolidation. Each actually enforces the permission — not cosmetic.",
              },
              {
                icon: Lock,
                title: "Immutable Audit Trail",
                desc: "Every consent grant, revocation, export, and deletion is logged with timestamps. Full accountability for data processing decisions.",
              },
              {
                icon: Download,
                title: "Full Data Portability",
                desc: "One-click JSON export of all dreams, symbols, clusters, and metadata. Your neural data is never trapped.",
              },
              {
                icon: Shield,
                title: "Permanent Deletion",
                desc: "Nuclear option: permanently erase all neural data. Irreversible. Because cognitive liberty means the right to forget.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl dream-glass-strong relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dream-accent-rose) / 0.3), transparent)" }} />
                <item.icon className="w-5 h-5 mb-3" style={{ color: "hsl(var(--dream-accent-rose))" }} />
                <h3 className="font-display font-bold text-sm text-foreground mb-2">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="dream-divider" />

      {/* ═══════════ TECH STACK ═══════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Built With</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-3">Technology Stack</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { name: "React + TypeScript", desc: "Type-safe UI framework" },
              { name: "Supabase", desc: "Auth, RLS, Postgres, Edge Fns" },
              { name: "Gemini AI", desc: "Dream analysis & image gen" },
              { name: "React Flow", desc: "Neural graph visualization" },
              { name: "Framer Motion", desc: "Animations & transitions" },
              { name: "Tailwind CSS", desc: "Design system & tokens" },
              { name: "Row-Level Security", desc: "Per-user data isolation" },
              { name: "Edge Functions", desc: "Serverless AI pipeline" },
            ].map((tech) => (
              <div key={tech.name} className="p-4 rounded-xl dream-glass text-center">
                <p className="text-xs font-display font-bold text-foreground">{tech.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{tech.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="dream-divider" />

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-32 overflow-hidden text-center">
        <GlowOrb color="primary" size={600} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-[-0.02em] mb-4">
              Explore Your<br /><span className="dream-text-gradient">Subconscious Atlas</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Record your dreams. Watch memory clusters form through hippocampal consolidation. 
              Maintain full sovereignty over your neural data. Contribute to humanity's collective dream intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-bold text-sm transition-all duration-300 dream-glow-strong text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
              >
                <Brain className="w-4 h-4" />
                Try the Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/clusters"
                className="dream-glass inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-bold text-sm text-foreground hover:border-primary/30 transition-all"
              >
                <Layers className="w-4 h-4 text-dream-cyan" />
                See Memory Clusters
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <div className="dream-divider mb-8" />
        <p className="text-[10px] text-muted-foreground">
          DreamOS — Built for PL_Genesis: Frontiers of Collaboration | Neurotech & Brain–Computer Interfaces Track
        </p>
      </footer>
    </div>
  );
};

export default Landing;
