import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, LogIn, UserPlus, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import GlowOrb from "@/components/GlowOrb";

const DEMO_EMAIL = "demo@dreamos.app";
const DEMO_PASSWORD = "demodreamos2024";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (signInError) {
        // If user doesn't exist, create the demo account
        const { error: signUpError } = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
        });
        if (signUpError) throw signUpError;

        // Sign in after signup
        const { error } = await supabase.auth.signInWithPassword({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
        });
        if (error) throw error;
      }

      toast.success("Welcome to DreamOS!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Demo login failed.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise flex items-center justify-center">
      <GlowOrb color="primary" size={500} className="-top-40 left-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 right-10" delay={3} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md mx-auto px-6 relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--dream-accent-cyan) / 0.1))",
              border: "1px solid hsl(var(--primary) / 0.3)",
              boxShadow: "0 0 40px hsl(var(--primary) / 0.2)",
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Brain className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold tracking-tight dream-text-gradient">
            DreamOS
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {isLogin ? "Welcome back, dreamer" : "Begin your dream journey"}
          </p>
        </div>

        {/* Form Card */}
        <div className="dream-glass-strong rounded-2xl p-8 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)" }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dreamer@example.com"
                className="dream-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="dream-input"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || demoLoading}
              whileHover={!loading ? { scale: 1.01 } : undefined}
              whileTap={!loading ? { scale: 0.99 } : undefined}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(265 60% 50%))",
                boxShadow: "0 0 30px hsl(var(--primary) / 0.25), 0 8px 20px hsl(var(--primary) / 0.15)",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 dream-divider" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">or</span>
            <div className="flex-1 dream-divider" />
          </div>

          {/* Demo Login */}
          <motion.button
            onClick={handleDemoLogin}
            disabled={loading || demoLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 text-foreground"
            style={{
              background: "hsl(var(--secondary))",
              border: "1px solid hsl(var(--dream-accent-amber) / 0.3)",
              boxShadow: "0 0 20px hsl(var(--dream-accent-amber) / 0.08)",
            }}
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-dream-amber" />
                Explore with Demo Account
              </>
            )}
          </motion.button>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
