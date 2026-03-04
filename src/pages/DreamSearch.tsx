import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDreams } from "@/lib/dreamData";
import GlowOrb from "@/components/GlowOrb";

const DreamSearch = () => {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? mockDreams.filter((d) => {
        const q = query.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.symbols.some((s) => s.toLowerCase().includes(q)) ||
          d.emotion.toLowerCase().includes(q) ||
          d.themes.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise">
      <GlowOrb color="primary" size={400} className="-top-20 right-20" />

      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-[-0.02em] text-foreground mb-4 leading-[0.95]">
              Search your <span className="dream-text-gradient">dreams</span>
            </h1>
            <p className="text-sm text-muted-foreground">Find dreams by keyword, symbol, emotion, or theme.</p>
          </div>

          {/* Search */}
          <div className="relative mb-10">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "flying", "ocean", or "wonder"...'
              className="dream-input pl-11 text-base"
              autoFocus
            />
          </div>

          {query.trim() && (
            <p className="text-xs text-muted-foreground mb-5">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="text-foreground font-medium">"{query}"</span>
            </p>
          )}

          <AnimatePresence mode="popLayout">
            {filtered.map((dream) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                className="mb-3"
              >
                <Link
                  to={`/dream/${dream.id}`}
                  className="group flex gap-4 p-4 rounded-2xl dream-card-hover"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={dream.generated_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{dream.description}</p>
                    <div className="flex gap-1.5 mt-2">
                      {dream.symbols.slice(0, 3).map((s) => (
                        <span key={s} className="dream-tag-cyan text-[10px] px-2 py-0.5 rounded-full border">{s}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {!query.trim() && (
            <div className="text-center py-24">
              <div
                className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--dream-accent-cyan) / 0.05))",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  boxShadow: "0 0 30px hsl(var(--primary) / 0.08)",
                }}
              >
                <SearchIcon className="w-7 h-7 text-primary/40" />
              </div>
              <p className="text-sm text-muted-foreground">Start typing to search your dream journal.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DreamSearch;
