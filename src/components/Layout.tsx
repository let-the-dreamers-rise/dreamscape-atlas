import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, PenLine, Clock, Map, Search, LogIn, LogOut, Layers, Shield, Users, Sparkles } from "lucide-react";
import StarField from "./StarField";
import OnboardingTour from "./OnboardingTour";
import PageTransition from "./PageTransition";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: Brain },
  { path: "/capture", label: "Record", icon: PenLine },
  { path: "/timeline", label: "Timeline", icon: Clock },
  { path: "/atlas", label: "Atlas", icon: Map },
  { path: "/clusters", label: "Memory", icon: Layers },
  { path: "/collective", label: "Collective", icon: Users },
  { path: "/sovereignty", label: "Sovereignty", icon: Shield },
  { path: "/search", label: "Search", icon: Search },
];

const mobileNavItems = [
  { path: "/", label: "Home", icon: Brain },
  { path: "/capture", label: "Record", icon: PenLine },
  { path: "/clusters", label: "Memory", icon: Layers },
  { path: "/atlas", label: "Atlas", icon: Map },
  { path: "/collective", label: "Collective", icon: Users },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />
      <OnboardingTour />

      {/* Desktop Navbar */}
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
                    className="relative px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-300"
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

            {/* Auth + Pitch */}
            <div className="flex items-center gap-2">
              <Link
                to="/landing"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-dream-amber transition-colors"
                style={{
                  background: "hsl(var(--dream-accent-amber) / 0.1)",
                  border: "1px solid hsl(var(--dream-accent-amber) / 0.25)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Pitch
              </Link>

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
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div
          className="dream-glass-strong mx-2 mb-2 rounded-2xl px-2 py-1.5 flex items-center justify-around"
          style={{ borderTop: "1px solid hsl(var(--border) / 0.3)" }}
        >
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "hsl(var(--primary) / 0.12)",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                    }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <item.icon className={`relative z-10 w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`relative z-10 text-[9px] font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="pt-16 pb-20 md:pb-0 relative z-10">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
