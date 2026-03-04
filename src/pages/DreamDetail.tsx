import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Heart, MapPin } from "lucide-react";
import { mockDreams } from "@/lib/dreamData";

const DreamDetail = () => {
  const { id } = useParams();
  const dream = mockDreams.find((d) => d.id === id);

  if (!dream) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Dream not found.</p>
        <Link to="/timeline" className="text-primary mt-4 inline-block">← Back to Timeline</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/timeline" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Timeline
        </Link>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 dream-glow">
          <img
            src={dream.generated_image}
            alt={dream.title}
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-xs text-dream-dim">{dream.date}</span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">{dream.title}</h1>
          </div>
        </div>

        {/* Description */}
        <div className="dream-card p-6 mb-6">
          <p className="text-foreground/90 leading-relaxed">{dream.description}</p>
        </div>

        {/* Analysis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="dream-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-display font-semibold text-foreground">Symbols</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dream.symbols.map((s) => (
                <span key={s} className="dream-tag-cyan text-xs px-2 py-1 rounded-full border">{s}</span>
              ))}
            </div>
          </div>

          <div className="dream-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-dream-rose" />
              <h3 className="text-sm font-display font-semibold text-foreground">Emotion</h3>
            </div>
            <span className="dream-tag-rose text-sm px-3 py-1 rounded-full border">{dream.emotion}</span>
          </div>

          <div className="dream-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-dream-amber" />
              <h3 className="text-sm font-display font-semibold text-foreground">Themes</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dream.themes.map((t) => (
                <span key={t} className="dream-tag-amber text-xs px-2 py-1 rounded-full border">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DreamDetail;
