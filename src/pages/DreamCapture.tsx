import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, Sparkles, Loader2, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import GlowOrb from "@/components/GlowOrb";

const DreamCapture = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState<"idle" | "analyzing" | "imaging" | "saving">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }

    setIsSubmitting(true);
    setStage("analyzing");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to record dreams.");
        setIsSubmitting(false);
        setStage("idle");
        return;
      }

      // Call AI analysis edge function
      const { data: analysis, error: fnError } = await supabase.functions.invoke("analyze-dream", {
        body: { title, description },
      });

      if (fnError) throw fnError;

      setStage("saving");

      // Save dream to database
      const { data: dream, error: dreamError } = await supabase
        .from("dreams")
        .insert({
          user_id: user.id,
          title,
          description,
          emotion: analysis?.emotion || null,
          themes: analysis?.themes || [],
          generated_image: analysis?.generated_image || null,
        })
        .select()
        .single();

      if (dreamError) throw dreamError;

      // Save symbols
      if (analysis?.symbols?.length) {
        for (const symbolName of analysis.symbols) {
          // Upsert symbol
          const { data: existingSymbol } = await supabase
            .from("symbols")
            .select("id, frequency")
            .eq("user_id", user.id)
            .eq("name", symbolName)
            .maybeSingle();

          let symbolId: string;
          if (existingSymbol) {
            await supabase
              .from("symbols")
              .update({ frequency: existingSymbol.frequency + 1 })
              .eq("id", existingSymbol.id);
            symbolId = existingSymbol.id;
          } else {
            const { data: newSymbol } = await supabase
              .from("symbols")
              .insert({ user_id: user.id, name: symbolName, frequency: 1 })
              .select()
              .single();
            symbolId = newSymbol!.id;
          }

          // Create relation
          await supabase.from("dream_symbols").insert({
            dream_id: dream.id,
            symbol_id: symbolId,
          });
        }
      }

      toast.success("Dream recorded & analyzed!");
      navigate(`/dream/${dream.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save dream.");
    } finally {
      setIsSubmitting(false);
      setStage("idle");
    }
  };

  const stageLabel = {
    idle: "",
    analyzing: "AI is decoding your dream...",
    imaging: "Generating dream visualization...",
    saving: "Saving to your atlas...",
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      <GlowOrb color="primary" size={500} className="-top-40 left-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 right-10" delay={3} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "hsl(265 80% 65% / 0.2)", border: "1px solid hsl(265 80% 65% / 0.3)" }}>
                <PenLine className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-primary">Dream Capture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
              What did you<br /><span className="dream-text-gradient">dream</span> last night?
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Describe everything you remember. Our AI will extract symbols, emotions, and generate a visual reconstruction of your dream.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Dream Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Glass City Above the Sea..."
                className="dream-input text-lg font-display"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I was floating above an endless purple ocean. In the distance, a city made entirely of glass was hovering above the waves, its towers catching light from a sun that seemed too close..."
                rows={8}
                className="dream-input resize-none leading-relaxed"
                maxLength={5000}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-dream-dim">{description.length}/5000</span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
              whileTap={!isSubmitting ? { scale: 0.99 } : undefined}
              className="w-full py-4 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              style={{
                background: isSubmitting
                  ? "hsl(240 18% 10%)"
                  : "linear-gradient(135deg, hsl(265 80% 65%), hsl(265 60% 50%))",
                color: "hsl(0 0% 100%)",
                boxShadow: isSubmitting ? "none" : "0 0 40px hsl(265 80% 65% / 0.3)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {stageLabel[stage]}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Record & Analyze Dream
                </>
              )}
            </motion.button>
          </form>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 p-5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(240 18% 8% / 0.7), hsl(265 20% 10% / 0.4))",
              border: "1px solid hsl(240 15% 15% / 0.5)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-dream-amber" />
              <span className="text-xs font-display font-semibold text-foreground">Pro Tip</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Include sensory details — colors, sounds, textures, emotions. The more vivid your description, the better the AI can reconstruct your dream world and identify meaningful patterns.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamCapture;
