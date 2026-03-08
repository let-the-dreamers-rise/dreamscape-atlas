import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Download, Trash2, Eye, EyeOff, FileText, AlertTriangle, CheckCircle, Brain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDreams } from "@/hooks/useDreams";
import GlowOrb from "@/components/GlowOrb";

interface ConsentState {
  aiAnalysis: boolean;
  imageGeneration: boolean;
  patternDetection: boolean;
  clusterFormation: boolean;
}

const NeuralSovereignty = () => {
  const { user } = useAuth();
  const { userDreams, loading } = useDreams();
  const [consent, setConsent] = useState<ConsentState>({
    aiAnalysis: true,
    imageGeneration: true,
    patternDetection: true,
    clusterFormation: true,
  });
  const [consentLogs, setConsentLogs] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch consent logs
    supabase
      .from("data_consent_log" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setConsentLogs(data);
      });
  }, [user]);

  const logConsent = async (action: string, scope: string, details: Record<string, unknown> = {}) => {
    if (!user) return;
    await supabase.from("data_consent_log" as any).insert({
      user_id: user.id,
      action,
      scope,
      details,
    } as any);
  };

  const toggleConsent = async (key: keyof ConsentState) => {
    const newValue = !consent[key];
    setConsent((prev) => ({ ...prev, [key]: newValue }));
    await logConsent(
      newValue ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
      key,
      { timestamp: new Date().toISOString() }
    );
    toast.success(`${key} consent ${newValue ? "granted" : "revoked"}`);
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);

    try {
      const { data: dreams } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id);

      const { data: symbols } = await supabase
        .from("symbols")
        .select("*")
        .eq("user_id", user.id);

      const { data: dreamSymbols } = await supabase
        .from("dream_symbols")
        .select("*");

      const exportData = {
        exportDate: new Date().toISOString(),
        userId: user.id,
        format: "DreamOS Neural Data Export v1.0",
        dreams: dreams || [],
        symbols: symbols || [],
        dreamSymbols: dreamSymbols || [],
        metadata: {
          totalDreams: dreams?.length || 0,
          totalSymbols: symbols?.length || 0,
          consentState: consent,
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dreamos-neural-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      await logConsent("DATA_EXPORT", "full_export", { format: "json" });
      toast.success("Neural data exported successfully");
    } catch (err) {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    setDeleting(true);

    try {
      await supabase.from("dream_symbols").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("dreams").delete().eq("user_id", user.id);
      await supabase.from("symbols").delete().eq("user_id", user.id);
      await supabase.from("memory_clusters").delete().eq("user_id", user.id);
      
      await logConsent("DATA_DELETION", "all_neural_data", {
        deletedAt: new Date().toISOString(),
      });

      toast.success("All neural data permanently deleted");
      setDeleteConfirm(false);
    } catch (err) {
      toast.error("Failed to delete data");
    } finally {
      setDeleting(false);
    }
  };

  const consentItems = [
    {
      key: "aiAnalysis" as keyof ConsentState,
      icon: Brain,
      title: "AI Dream Analysis",
      description: "Allow AI to analyze dream descriptions for symbols, emotions, and themes.",
      color: "hsl(var(--primary))",
    },
    {
      key: "imageGeneration" as keyof ConsentState,
      icon: Eye,
      title: "Image Generation",
      description: "Allow AI to generate visual reconstructions from dream descriptions.",
      color: "hsl(var(--dream-accent-violet))",
    },
    {
      key: "patternDetection" as keyof ConsentState,
      icon: FileText,
      title: "Pattern Detection",
      description: "Allow the system to detect recurring patterns across your dreams.",
      color: "hsl(var(--dream-accent-cyan))",
    },
    {
      key: "clusterFormation" as keyof ConsentState,
      icon: Brain,
      title: "Memory Consolidation",
      description: "Allow hippocampal clustering engine to form memory clusters from your dreams.",
      color: "hsl(var(--dream-accent-amber))",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Sign in to manage your neural data sovereignty.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] dream-noise">
      <GlowOrb color="primary" size={400} className="-top-40 right-1/4" />
      <GlowOrb color="cyan" size={300} className="bottom-20 left-10" delay={2} />

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--dream-accent-rose) / 0.25), hsl(var(--primary) / 0.15))",
                  border: "1px solid hsl(var(--dream-accent-rose) / 0.4)",
                  boxShadow: "0 0 20px hsl(var(--dream-accent-rose) / 0.15)",
                }}
              >
                <Shield className="w-3.5 h-3.5" style={{ color: "hsl(var(--dream-accent-rose))" }} />
              </div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "hsl(var(--dream-accent-rose) / 0.8)" }}>
                Cognitive Liberty
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-[-0.02em] text-foreground mb-4 leading-[0.95]">
              Neural Data<br />
              <span className="dream-text-gradient">Sovereignty</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Your dream data is an extension of your cognition. You have complete ownership, 
              granular consent controls, and the right to export or delete everything at any time.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Dreams Stored", value: userDreams.length, color: "hsl(var(--primary))" },
              { label: "Consent Logs", value: consentLogs.length, color: "hsl(var(--dream-accent-cyan))" },
              { label: "Data Status", value: "Encrypted", color: "hsl(var(--dream-accent-amber))" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl dream-glass-strong text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)` }} />
                <p className="text-2xl font-display font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Consent Controls */}
          <div className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Granular Consent Controls</h2>
            <div className="space-y-3">
              {consentItems.map((item) => (
                <motion.div
                  key={item.key}
                  className="p-5 rounded-xl dream-glass-strong relative overflow-hidden"
                  whileHover={{ scale: 1.005 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${item.color}30, transparent)` }} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm text-foreground">{item.title}</h3>
                        <p className="text-[11px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConsent(item.key)}
                      className="relative w-12 h-7 rounded-full transition-all duration-300"
                      style={{
                        background: consent[item.key] ? item.color : "hsl(var(--muted))",
                        boxShadow: consent[item.key] ? `0 0 15px ${item.color}40` : "none",
                      }}
                    >
                      <div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300"
                        style={{ left: consent[item.key] ? "calc(100% - 24px)" : "4px" }}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="p-5 rounded-xl dream-glass-strong text-left relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dream-accent-cyan) / 0.4), transparent)" }} />
              <Download className="w-5 h-5 mb-3" style={{ color: "hsl(var(--dream-accent-cyan))" }} />
              <h3 className="font-display font-bold text-sm text-foreground mb-1">Export All Data</h3>
              <p className="text-[11px] text-muted-foreground">Download complete neural data as JSON — dreams, symbols, clusters, metadata.</p>
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              className="p-5 rounded-xl dream-glass-strong text-left relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--destructive) / 0.4), transparent)" }} />
              <Trash2 className="w-5 h-5 mb-3 text-destructive" />
              <h3 className="font-display font-bold text-sm text-foreground mb-1">Delete All Data</h3>
              <p className="text-[11px] text-muted-foreground">Permanently erase all neural data. This action cannot be undone.</p>
            </button>
          </div>

          {/* Delete Confirmation */}
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: "hsl(var(--destructive) / 0.05)",
                border: "1px solid hsl(var(--destructive) / 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-display font-bold text-sm text-foreground">Confirm Permanent Deletion</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                This will permanently delete all your dreams, symbols, memory clusters, and associated neural data. 
                We recommend exporting your data first.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-destructive-foreground transition-all"
                  style={{ background: "hsl(var(--destructive))" }}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Everything"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-foreground dream-glass"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Consent Audit Trail */}
          {consentLogs.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Consent Audit Trail</h2>
              <div className="space-y-2">
                {consentLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl dream-glass text-xs">
                    {log.action.includes("GRANT") ? (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--dream-accent-cyan))" }} />
                    ) : log.action.includes("DELETE") ? (
                      <Trash2 className="w-3.5 h-3.5 text-destructive shrink-0" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-bold text-foreground">{log.action}</span>
                      <span className="text-muted-foreground ml-2">→ {log.scope}</span>
                    </div>
                    <span className="text-muted-foreground text-[10px] shrink-0">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NeuralSovereignty;
