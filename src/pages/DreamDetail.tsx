import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Heart, MapPin, Brain } from "lucide-react";
import { mockDreams } from "@/lib/dreamData";
import GlowOrb from "@/components/GlowOrb";

const DreamDetail = () => {
  const { id } = useParams();
  const dream = mockDreams.find((d) => d.id === id);

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
    <div className="relative">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <img src={dream.generated_image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/30" />
        <GlowOrb color="primary" size={300} className="bottom-0 left-1/4" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Link
            to="/timeline"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Timeline
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] tracking-wider uppercase text-dream-dim">{dream.date}</span>
            <span className="dream-tag text-[10px]">{dream.emotion}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
            {dream.title}
          </h1>

          {/* Description */}
          <div
            className="p-6 rounded-2xl mb-8"
            style={{
              background: "linear-gradient(135deg, hsl(240 18% 8% / 0.7), hsl(265 20% 10% / 0.4))",
              border: "1px solid hsl(240 15% 15% / 0.5)",
            }}
          >
            <p className="text-foreground/85 leading-relaxed text-[15px]">{dream.description}</p>
          </div>

          {/* AI Analysis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl"
              style={{
                background: "hsl(240 18% 8% / 0.6)",
                border: "1px solid hsl(265 80% 65% / 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-display font-semibold text-foreground">Symbols</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dream.symbols.map((s) => (
                  <span key={s} className="dream-tag-cyan text-[10px] px-2.5 py-1 rounded-full border">{s}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl"
              style={{
                background: "hsl(240 18% 8% / 0.6)",
                border: "1px solid hsl(340 70% 65% / 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-3.5 h-3.5 text-dream-rose" />
                <span className="text-xs font-display font-semibold text-foreground">Emotion</span>
              </div>
              <span className="dream-tag-rose text-xs px-3 py-1.5 rounded-full border">{dream.emotion}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl"
              style={{
                background: "hsl(240 18% 8% / 0.6)",
                border: "1px solid hsl(35 90% 60% / 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-3.5 h-3.5 text-dream-amber" />
                <span className="text-xs font-display font-semibold text-foreground">Themes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dream.themes.map((t) => (
                  <span key={t} className="dream-tag-amber text-[10px] px-2.5 py-1 rounded-full border">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamDetail;
