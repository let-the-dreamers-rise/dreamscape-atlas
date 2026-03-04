import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Clock, Map, Search } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Brain },
  { path: "/capture", label: "Record Dream", icon: PenLine },
  { path: "/timeline", label: "Timeline", icon: Clock },
  { path: "/atlas", label: "Dream Atlas", icon: Map },
  { path: "/search", label: "Search", icon: Search },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen dream-gradient-bg">
      {/* Ambient orbs */}
      <div className="dream-orb w-[600px] h-[600px] -top-[200px] -left-[200px] bg-primary animate-pulse-glow fixed" />
      <div className="dream-orb w-[400px] h-[400px] top-[60%] -right-[150px] bg-dream-cyan animate-pulse-glow fixed" style={{ animationDelay: "1.5s" }} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center dream-glow">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display text-lg font-bold dream-text-gradient">DreamOS</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-primary/20 border border-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
