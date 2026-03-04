import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Clock, Map, Search } from "lucide-react";
import StarField from "./StarField";

const navItems = [
  { path: "/", label: "Dashboard", icon: Brain },
  { path: "/capture", label: "Record", icon: PenLine },
  { path: "/timeline", label: "Timeline", icon: Clock },
  { path: "/atlas", label: "Atlas", icon: Map },
  { path: "/search", label: "Search", icon: Search },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30">
        <div className="absolute inset-0 backdrop-blur-2xl bg-background/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, hsl(265 80% 65% / 0.3), hsl(195 90% 60% / 0.2))",
                  border: "1px solid hsl(265 80% 65% / 0.3)",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="w-4 h-4 text-primary" />
                <div className="absolute inset-0 rounded-lg" style={{ boxShadow: "0 0 20px hsl(265 80% 65% / 0.2)" }} />
              </motion.div>
              <span className="font-display text-base font-bold tracking-tight dream-text-gradient">
                DreamOS
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "linear-gradient(135deg, hsl(265 80% 65% / 0.15), hsl(195 90% 60% / 0.1))",
                          border: "1px solid hsl(265 80% 65% / 0.2)",
                        }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`p-2 rounded-lg transition-all ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <item.icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-14 relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
