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
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <GlowOrb color="primary" size={400} className="-top-20 right-20" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
              Search your <span className="dream-text-gradient">dreams</span>
            </h1>
            <p className="text-sm text-muted-foreground">Find dreams by keyword, symbol, emotion, or theme.</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
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
            <p className="text-xs text-muted-foreground mb-4">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="text-foreground">"{query}"</span>
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
                  className="group flex gap-4 p-4 rounded-2xl transition-all duration-500 hover:translate-y-[-1px]"
                  style={{
                    background: "hsl(240 18% 8% / 0.5)",
                    border: "1px solid hsl(240 15% 15% / 0.5)",
                  }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={dream.generated_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
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
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(265 80% 65% / 0.1)", border: "1px solid hsl(265 80% 65% / 0.2)" }}>
                <SearchIcon className="w-6 h-6 text-primary/50" />
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
