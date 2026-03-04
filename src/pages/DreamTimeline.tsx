import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { mockDreams } from "@/lib/dreamData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DreamTimeline = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-dream-cyan/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-dream-cyan" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dream Timeline</h1>
        </div>
        <p className="text-muted-foreground mb-10 ml-[52px]">Your memories, in chronological order.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {mockDreams.map((dream) => (
          <motion.div key={dream.id} variants={item}>
            <Link to={`/dream/${dream.id}`} className="dream-card-hover flex flex-col sm:flex-row gap-5 p-5 group">
              <img
                src={dream.generated_image}
                alt={dream.title}
                className="w-full sm:w-48 h-36 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-dream-dim">{dream.date}</span>
                  <span className="dream-tag">{dream.emotion}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {dream.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{dream.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {dream.symbols.map((s) => (
                    <span key={s} className="dream-tag-cyan text-xs px-2 py-0.5 rounded-full border">{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DreamTimeline;
