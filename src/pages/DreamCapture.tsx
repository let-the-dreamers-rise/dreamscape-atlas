import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DreamCapture = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both the title and description.");
      return;
    }
    setIsSubmitting(true);
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    toast.success("Dream recorded! AI analysis complete.");
    navigate("/timeline");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Record a Dream</h1>
        </div>
        <p className="text-muted-foreground mb-8 ml-[52px]">
          Describe what you experienced. Our AI will extract symbols, emotions, and generate a visual reconstruction.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dream Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Glass City Above the Sea"
              className="dream-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dream Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe everything you remember... the places, feelings, people, colors, sounds..."
              rows={8}
              className="dream-input resize-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 dream-glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Dream...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Record & Analyze Dream
              </>
            )}
          </motion.button>
        </form>

        {/* Example prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="dream-card p-5 mt-8"
        >
          <p className="text-sm text-muted-foreground mb-2 font-medium">💡 Example</p>
          <p className="text-sm text-foreground/80 italic">
            "I was flying above a purple ocean and saw a floating glass city. The buildings shimmered with an inner light, and I could hear distant music echoing across the waves."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DreamCapture;
