import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, PenLine, Layers, Map, Shield, Users, ArrowRight, X, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const TOUR_KEY = "dreamos_tour_seen";

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  route: string;
  label: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Record Dreams",
    description: "Capture your dreams before they fade. AI analyzes symbols, emotions, and themes in real-time.",
    icon: PenLine,
    color: "hsl(var(--primary))",
    route: "/capture",
    label: "Dream Capture",
  },
  {
    title: "Memory Consolidation",
    description: "Watch hippocampal-style memory clusters form as the engine detects recurring symbol patterns across your dreams.",
    icon: Layers,
    color: "hsl(var(--dream-accent-cyan))",
    route: "/clusters",
    label: "Clusters",
  },
  {
    title: "Neural Atlas",
    description: "Explore an interactive force-directed graph of your dream symbols, connections, and consolidated memory hubs.",
    icon: Map,
    color: "hsl(var(--dream-accent-violet))",
    route: "/atlas",
    label: "Atlas",
  },
  {
    title: "Neural Sovereignty",
    description: "Full control over your cognitive data: granular consent, data export, permanent deletion, and an immutable audit trail.",
    icon: Shield,
    color: "hsl(var(--dream-accent-rose))",
    route: "/sovereignty",
    label: "Sovereignty",
  },
  {
    title: "Collective Intelligence",
    description: "Anonymous aggregate dream statistics — shared archetypes and emotion patterns across all dreamers. Privacy-preserving.",
    icon: Users,
    color: "hsl(var(--dream-accent-amber))",
    route: "/collective",
    label: "Collective",
  },
];

const OnboardingTour = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only show on dashboard
    if (location.pathname !== "/") return;
    const seen = localStorage.getItem(TOUR_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const goToStep = (route: string) => {
    dismiss();
    navigate(route);
  };

  const nextStep = () => {
    if (step < tourSteps.length - 1) setStep(step + 1);
    else dismiss();
  };

  const current = tourSteps[step];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: "hsl(var(--background) / 0.8)", backdropFilter: "blur(8px)" }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.15 }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-[101] w-auto sm:w-full sm:max-w-lg"
          >
            <div className="dream-glass-strong rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* Top glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${current.color}60, transparent)` }}
              />
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl"
                style={{ background: current.color }}
              />

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: "hsl(var(--muted) / 0.5)" }}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  Welcome to DreamOS
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {step + 1} / {tourSteps.length}
                </span>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${current.color}15`, border: `1px solid ${current.color}25` }}
                  >
                    <current.icon className="w-6 h-6" style={{ color: current.color }} />
                  </div>

                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">{current.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 mb-6">
                {tourSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 24 : 8,
                      background: i === step ? current.color : "hsl(var(--muted))",
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goToStep(current.route)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm text-primary-foreground transition-all duration-300 dream-glow-strong"
                  style={{ background: `linear-gradient(135deg, ${current.color}, hsl(280 70% 50%))` }}
                >
                  Go to {current.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={nextStep}
                  className="px-5 py-3 rounded-xl font-display font-semibold text-sm text-foreground dream-glass hover:border-primary/30 transition-all"
                >
                  {step < tourSteps.length - 1 ? "Next" : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
