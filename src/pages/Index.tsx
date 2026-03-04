import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PenLine, Clock, Map, Sparkles, ArrowRight, Brain } from "lucide-react";
import { mockDreams, mockSymbols } from "@/lib/dreamData";
import GlowOrb from "@/components/GlowOrb";
import dreamHero from "@/assets/dream-hero.jpg";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const Dashboard = () => {
  const recentDreams = mockDreams.slice(0, 3);
  const topSymbols = [...mockSymbols].sort((a, b) => b.frequency - a.frequency).slice(0, 5);

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img src={dreamHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        <GlowOrb color="primary" size={600} className="-top-40 -left-40" />
        <GlowOrb color="cyan" size={400} className="top-20 right-10" delay={2} />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-end pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "hsl(265 80% 65% / 0.2)", border: "1px solid hsl(265 80% 65% / 0.3)" }}>
              <Brain className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">Dream Operating System</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.9] mb-4">
            <span className="text-foreground">The</span>
            <br />
            <span className="dream-text-gradient">Subconscious</span>
            <br />
            <span className="text-foreground">Atlas</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Record your dreams. Let AI decode the patterns. Explore the hidden architecture of your mind through an interactive visual atlas.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link
              to="/capture"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 dream-glow-strong"
              style={{
                background: "linear-gradient(135deg, hsl(265 80% 65%), hsl(265 60% 50%))",
                color: "hsl(0 0% 100%)",
              }}
            >
              <PenLine className="w-4 h-4" />
              Record a Dream
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/atlas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm text-foreground transition-all duration-300 hover:border-primary/40"
              style={{
                background: "hsl(240 18% 8% / 0.6)",
                border: "1px solid hsl(240 15% 20%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Map className="w-4 h-4 text-dream-cyan" />
              Explore Atlas
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <GlowOrb color="violet" size={500} className="-right-60 top-0" delay={4} />

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {[
            { label: "Dreams", value: "24", sub: "recorded" },
            { label: "Symbols", value: "47", sub: "discovered" },
            { label: "Streak", value: "7", sub: "nights" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl" style={{ background: "hsl(240 18% 8% / 0.5)", border: "1px solid hsl(240 15% 15% / 0.5)" }}>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-16"
        >
          {[
            { to: "/capture", icon: PenLine, label: "Record Dream", desc: "Capture tonight's dream", color: "primary" },
            { to: "/timeline", icon: Clock, label: "Timeline", desc: "Browse your memory feed", color: "cyan" },
            { to: "/atlas", icon: Map, label: "Dream Atlas", desc: "Explore symbol connections", color: "violet" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group p-5 rounded-2xl transition-all duration-500 hover:translate-y-[-2px]"
              style={{
                background: "linear-gradient(135deg, hsl(240 18% 8%), hsl(240 18% 10%))",
                border: "1px solid hsl(240 15% 15%)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(--${link.color === "primary" ? "primary" : `dream-accent-${link.color}`}) / 0.1)` }}>
                  <link.icon className={`w-4 h-4 text-${link.color === "primary" ? "primary" : `dream-${link.color}`}`} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="font-display font-semibold text-sm text-foreground">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </motion.div>

        {/* Recent + Symbols */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Recent Dreams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Recent Dreams</h2>
              <Link to="/timeline" className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentDreams.map((dream, i) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/dream/${dream.id}`}
                    className="group flex gap-4 p-4 rounded-2xl transition-all duration-500 hover:translate-y-[-1px]"
                    style={{
                      background: "hsl(240 18% 8% / 0.5)",
                      border: "1px solid hsl(240 15% 15% / 0.5)",
                    }}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={dream.generated_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] tracking-wider uppercase text-dream-dim">{dream.date}</span>
                        <span className="dream-tag text-[10px]">{dream.emotion}</span>
                      </div>
                      <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{dream.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Symbols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Top Symbols</h2>
            </div>
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: "linear-gradient(135deg, hsl(240 18% 8% / 0.7), hsl(265 20% 10% / 0.5))",
                border: "1px solid hsl(240 15% 15% / 0.5)",
              }}
            >
              {topSymbols.map((symbol, i) => (
                <motion.div
                  key={symbol.id}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-dream-dim font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-foreground">{symbol.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "hsl(240 15% 15%)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(265 80% 65%), hsl(195 90% 60%))" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(symbol.frequency / 12) * 100}%` }}
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
