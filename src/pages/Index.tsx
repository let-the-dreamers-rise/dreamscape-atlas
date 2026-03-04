import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, PenLine, Clock, Map, Sparkles, TrendingUp } from "lucide-react";
import { mockDreams, mockSymbols } from "@/lib/dreamData";

const statCards = [
  { label: "Dreams Recorded", value: "24", icon: Brain, color: "primary" },
  { label: "Symbols Found", value: "47", icon: Sparkles, color: "dream-cyan" },
  { label: "Dream Streak", value: "7 days", icon: TrendingUp, color: "dream-violet" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Dashboard = () => {
  const recentDreams = mockDreams.slice(0, 3);
  const topSymbols = [...mockSymbols].sort((a, b) => b.frequency - a.frequency).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Hero */}
        <motion.div variants={item} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            <span className="dream-text-gradient">The Subconscious Atlas</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Map the landscapes of your mind. Record dreams, discover patterns, and explore the hidden architecture of your subconscious.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link to="/capture" className="dream-card-hover p-5 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <PenLine className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">Record Dream</p>
              <p className="text-sm text-muted-foreground">Capture a new dream</p>
            </div>
          </Link>
          <Link to="/timeline" className="dream-card-hover p-5 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-dream-cyan/10 flex items-center justify-center group-hover:bg-dream-cyan/20 transition-colors">
              <Clock className="w-6 h-6 text-dream-cyan" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">Timeline</p>
              <p className="text-sm text-muted-foreground">Browse dream history</p>
            </div>
          </Link>
          <Link to="/atlas" className="dream-card-hover p-5 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-dream-violet/10 flex items-center justify-center group-hover:bg-dream-violet/20 transition-colors">
              <Map className="w-6 h-6 text-dream-violet" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">Dream Atlas</p>
              <p className="text-sm text-muted-foreground">Explore symbol map</p>
            </div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {statCards.map((stat) => (
            <div key={stat.label} className="dream-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Dreams */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Recent Dreams</h2>
              <Link to="/timeline" className="text-sm text-primary hover:text-primary/80 transition-colors">View all →</Link>
            </div>
            <div className="space-y-4">
              {recentDreams.map((dream) => (
                <Link key={dream.id} to={`/dream/${dream.id}`} className="dream-card-hover p-4 flex gap-4 group">
                  <img
                    src={dream.generated_image}
                    alt={dream.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">{dream.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dream.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-dream-dim">{dream.date}</span>
                      <span className="dream-tag">{dream.emotion}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Top Symbols */}
          <motion.div variants={item}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Top Symbols</h2>
            <div className="dream-card p-5 space-y-3">
              {topSymbols.map((symbol) => (
                <div key={symbol.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{symbol.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(symbol.frequency / 12) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right">{symbol.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
