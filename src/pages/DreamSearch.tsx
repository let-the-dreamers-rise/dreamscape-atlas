import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDreams } from "@/lib/dreamData";

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-dream-amber/10 flex items-center justify-center">
            <SearchIcon className="w-5 h-5 text-dream-amber" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Search Dreams</h1>
        </div>
        <p className="text-muted-foreground mb-8 ml-[52px]">Search by keyword, symbol, emotion, or theme.</p>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "flying", "ocean", or "wonder"...'
            className="dream-input pl-12"
            autoFocus
          />
        </div>

        {query.trim() && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
          </p>
        )}

        <div className="space-y-4">
          {filtered.map((dream) => (
            <motion.div key={dream.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/dream/${dream.id}`} className="dream-card-hover p-4 flex gap-4 group">
                <img src={dream.generated_image} alt={dream.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{dream.description}</p>
                  <div className="flex gap-1.5 mt-2">
                    {dream.symbols.slice(0, 3).map((s) => (
                      <span key={s} className="dream-tag-cyan text-xs px-2 py-0.5 rounded-full border">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {!query.trim() && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Start typing to search your dream journal.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DreamSearch;
