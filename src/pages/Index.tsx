import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PenLine, Clock, Map, Sparkles, ArrowRight, Brain, Zap, TrendingUp } from "lucide-react";
import { useDreams, useSymbols } from "@/hooks/useDreams";
import { generatePatternInsights, PatternInsight } from "@/lib/patternInsights";
import GlowOrb from "@/components/GlowOrb";
import dreamHero from "@/assets/dream-hero.jpg";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const insightColorMap: Record<string, { icon: string; border: string; glow: string }> = {
  primary: { icon: "text-primary", border: "hsl(var(--primary) / 0.2)", glow: "hsl(var(--primary) / 0.08)" },
  cyan: { icon: "text-dream-cyan", border: "hsl(var(--dream-accent-cyan) / 0.2)", glow: "hsl(var(--dream-accent-cyan) / 0.08)" },
  rose: { icon: "text-dream-rose", border: "hsl(var(--dream-accent-rose) / 0.2)", glow: "hsl(var(--dream-accent-rose) / 0.08)" },
  amber: { icon: "text-dream-amber", border: "hsl(var(--dream-accent-amber) / 0.2)", glow: "hsl(var(--dream-accent-amber) / 0.08)" },
};

const InsightCard = ({ insight, index }: { insight: PatternInsight; index: number }) => {
  const colors = insightColorMap[insight.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="dream-glass-strong rounded-2xl p-5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }} />
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: colors.glow, border: `1px solid ${colors.border}` }}
        >
          <TrendingUp className={`w-3.5 h-3.5 ${colors.icon}`} />
        </div>
        <div>
          <p className="font-display font-bold text-sm text-foreground mb-1">{insight.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { allDreams, userDreams } = useDreams();
  const allSymbols = useSymbols(allDreams);
  const topSymbols = [...allSymbols].sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  const recentDreams = allDreams.slice(0, 3);
  const insights = generatePatternInsights(allDreams, allSymbols);

  const totalDreams = allDreams.length;
  const totalSymbols = allSymbols.length;

  return (
    <div className="relative dream-noise">
      {/* HERO */}
      <div className="relative h-[calc(100vh-4rem)] min-h-[640px] md:min-h-[700px] lg:min-h-[760px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={dreamHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 dream-aurora opacity-60" />
        </div>

        <GlowOrb color="primary" size={700} className="-top-60 -left-60" />
        <GlowOrb color="cyan" size={500} className="top-10 right-0" delay={2} />
        <GlowOrb color="violet" size={350} className="bottom-20 left-1/3" delay={4} />

        <motion.div
          className="relative z-10 h-full flex flex-col justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-6">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--dream-accent-cyan) / 0.15))",
                border: "1px solid hsl(var(--primary) / 0.4)",
                boxShadow: "0 0 20px hsl(var(--primary) / 0.15)",
              }}
            >
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary/80">Dream Operating System</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.75rem] xl:text-[8rem] font-display font-bold tracking-[-0.03em] leading-[0.88] mb-5 md:mb-6 max-w-4xl"
          >
            <span className="text-foreground block">The</span>
            <span className="dream-text-gradient block">Subconscious</span>
            <span className="text-foreground block">Atlas</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base text-muted-foreground max-w-md mb-10 leading-relaxed">
            Record your dreams. Let AI decode the patterns. Explore the hidden architecture of your mind through an interactive visual atlas.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link
              to="/capture"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-300 dream-glow-strong text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(280 70% 50%))" }}
            >
              <PenLine className="w-4 h-4" />
              Record a Dream
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/atlas"
              className="dream-glass inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-display font-semibold text-sm text-foreground transition-all duration-300 hover:border-primary/30"
            >
              <Map className="w-4 h-4 text-dream-cyan" />
              Explore Atlas
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="dream-divider" />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 relative">
        <GlowOrb color="violet" size={500} className="-right-60 top-0" delay={4} />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 sm:gap-6 mb-20"
        >
          {[
            { label: "Dreams", value: String(totalDreams), sub: "recorded", icon: Brain },
            { label: "Symbols", value: String(totalSymbols), sub: "discovered", icon: Sparkles },
            { label: "Insights", value: String(insights.length), sub: "patterns found", icon: Zap },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="dream-glass-strong rounded-2xl p-6 sm:p-8 text-center group hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-4xl sm:text-5xl font-display font-bold dream-text-gradient">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20"
        >
          {[
            { to: "/capture", icon: PenLine, label: "Record Dream", desc: "Capture tonight's dream before it fades", color: "primary" },
            { to: "/timeline", icon: Clock, label: "Timeline", desc: "Browse your chronological memory feed", color: "cyan" },
            { to: "/atlas", icon: Map, label: "Dream Atlas", desc: "Explore your subconscious symbol map", color: "violet" },
          ].map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={link.to} className="group block p-6 rounded-2xl dream-card-hover relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(var(--${link.color === "primary" ? "primary" : `dream-accent-${link.color}`}) / 0.4), transparent)` }} />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(--${link.color === "primary" ? "primary" : `dream-accent-${link.color}`}) / 0.1)`, border: `1px solid hsl(var(--${link.color === "primary" ? "primary" : `dream-accent-${link.color}`}) / 0.2)` }}>
                    <link.icon className={`w-4.5 h-4.5 text-${link.color === "primary" ? "primary" : `dream-${link.color}`}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="font-display font-bold text-foreground text-base">{link.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="dream-divider mb-20" />

        {/* Pattern Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--dream-accent-amber) / 0.15)", border: "1px solid hsl(var(--dream-accent-amber) / 0.25)" }}>
                <TrendingUp className="w-3.5 h-3.5 text-dream-amber" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Detected Patterns</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        <div className="dream-divider mb-20" />

        {/* Recent + Symbols */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Recent Dreams</h2>
              <Link to="/timeline" className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentDreams.map((dream, i) => (
                <motion.div key={dream.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/dream/${dream.id}`} className="group flex gap-4 p-4 rounded-2xl dream-card-hover">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={dream.generated_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] tracking-wider uppercase text-dream-dim">{dream.date}</span>
                        <span className="dream-tag text-[10px]">{dream.emotion}</span>
                      </div>
                      <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{dream.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">Top Symbols</h2>
            </div>
            <div className="dream-glass-strong rounded-2xl p-6 space-y-5">
              {topSymbols.map((symbol, i) => (
                <motion.div key={symbol.id} className="flex items-center justify-between" initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-dream-dim font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold text-foreground">{symbol.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--dream-accent-cyan)))" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(symbol.frequency / Math.max(...topSymbols.map(s => s.frequency), 1)) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono w-4 text-right">{symbol.frequency}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
