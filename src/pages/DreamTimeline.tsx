import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { mockDreams } from "@/lib/dreamData";
import GlowOrb from "@/components/GlowOrb";

const DreamTimeline = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise">
      <GlowOrb color="cyan" size={400} className="-top-20 right-0" />
      <GlowOrb color="primary" size={300} className="bottom-40 -left-20" delay={2} />

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--dream-accent-cyan) / 0.25), hsl(var(--primary) / 0.15))",
                border: "1px solid hsl(var(--dream-accent-cyan) / 0.4)",
                boxShadow: "0 0 20px hsl(var(--dream-accent-cyan) / 0.15)",
              }}
            >
              <Clock className="w-3.5 h-3.5 text-dream-cyan" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-dream-cyan/80">Memory Feed</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-[-0.02em] text-foreground mb-3 leading-[0.95]">
            Dream <span className="dream-text-gradient">Timeline</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-14">Your subconscious memories, in chronological order.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.4), hsl(var(--dream-accent-cyan) / 0.2), transparent)" }} />

          <div className="space-y-10">
            {mockDreams.map((dream, i) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div
                  className="absolute left-[12px] top-6 w-[15px] h-[15px] rounded-full border-2"
                  style={{
                    borderColor: "hsl(var(--primary))",
                    background: "hsl(var(--background))",
                    boxShadow: "0 0 10px hsl(var(--primary) / 0.3)",
                  }}
                />

                <Link
                  to={`/dream/${dream.id}`}
                  className="group block rounded-2xl overflow-hidden dream-card-hover"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dream.generated_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] tracking-wider uppercase text-dream-dim">{dream.date}</span>
                        <span className="dream-tag text-[10px]">{dream.emotion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {dream.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{dream.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dream.symbols.map((s) => (
                        <span key={s} className="dream-tag-cyan text-[10px] px-2.5 py-0.5 rounded-full border">{s}</span>
                      ))}
                      {dream.themes.map((t) => (
                        <span key={t} className="dream-tag-amber text-[10px] px-2.5 py-0.5 rounded-full border">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamTimeline;
