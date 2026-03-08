import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Clock, Map, Search, LogIn, LogOut, Layers, Shield } from "lucide-react";
import StarField from "./StarField";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: Brain },
  { path: "/capture", label: "Record", icon: PenLine },
  { path: "/timeline", label: "Timeline", icon: Clock },
  { path: "/atlas", label: "Atlas", icon: Map },
  { path: "/clusters", label: "Memory", icon: Layers },
  { path: "/sovereignty", label: "Sovereignty", icon: Shield },
  { path: "/search", label: "Search", icon: Search },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 dream-glass-strong" style={{ borderBottom: "1px solid hsl(var(--border) / 0.3)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--dream-accent-cyan) / 0.1))",
                  border: "1px solid hsl(var(--primary) / 0.3)",
                  boxShadow: "0 0 25px hsl(var(--primary) / 0.15)",
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Brain className="w-4.5 h-4.5 text-primary" />
              </motion.div>
              <span className="font-display text-base font-bold tracking-tight dream-text-gradient">
                DreamOS
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl dream-glass">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--dream-accent-cyan) / 0.1))",
                          border: "1px solid hsl(var(--primary) / 0.25)",
                          boxShadow: "0 0 15px hsl(var(--primary) / 0.1)",
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

            {/* Auth button */}
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors dream-glass"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-primary-foreground transition-colors"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(265 60% 50%))",
                    boxShadow: "0 0 15px hsl(var(--primary) / 0.2)",
                  }}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile nav */}
              <div className="flex md:hidden items-center gap-0.5 p-1 rounded-xl dream-glass">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`p-2 rounded-lg transition-all ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                    >
                      <item.icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
