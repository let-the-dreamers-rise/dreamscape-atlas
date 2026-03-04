import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Heart, Brain } from "lucide-react";
import { useDreams } from "@/hooks/useDreams";
import GlowOrb from "@/components/GlowOrb";

const DreamDetail = () => {
  const { id } = useParams();
  const { allDreams, loading } = useDreams();
  const dream = allDreams.find((d) => d.id === id);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Dream not found in the atlas.</p>
          <Link to="/timeline" className="text-primary text-sm">← Back to Timeline</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative dream-noise">
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img src={dream.generated_image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
        <div className="absolute inset-0 dream-aurora opacity-40" />
        <GlowOrb color="primary" size={300} className="bottom-0 left-1/4" />
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 -mt-36 relative z-10 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <Link to="/timeline" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Timeline
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] tracking-wider uppercase text-dream-dim">{dream.date}</span>
            <span className="dream-tag text-[10px]">{dream.emotion}</span>
            {(dream as any).isUserDream && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">YOUR DREAM</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-[-0.02em] text-foreground mb-8">{dream.title}</h1>

          <div className="dream-glass-strong rounded-2xl p-7 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
            <p className="text-foreground/85 leading-relaxed text-[15px]">{dream.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, label: "Symbols", color: "primary", items: dream.symbols, tagClass: "dream-tag-cyan", delay: 0.2 },
              { icon: Heart, label: "Emotion", color: "dream-accent-rose", items: [dream.emotion], tagClass: "dream-tag-rose", delay: 0.3 },
              { icon: Brain, label: "Themes", color: "dream-accent-amber", items: dream.themes, tagClass: "dream-tag-amber", delay: 0.4 },
            ].map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
                className="dream-glass-strong rounded-2xl p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(var(--${card.color}) / 0.3), transparent)` }} />
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className={`w-3.5 h-3.5 text-${card.color === "primary" ? "primary" : card.color.includes("rose") ? "dream-rose" : "dream-amber"}`} />
                  <span className="text-xs font-display font-bold text-foreground">{card.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.items.map((item) => (
                    <span key={item} className={`${card.tagClass} text-[10px] px-2.5 py-1 rounded-full border`}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamDetail;
