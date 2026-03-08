import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConsentState {
  aiAnalysis: boolean;
  imageGeneration: boolean;
  patternDetection: boolean;
  clusterFormation: boolean;
}

const DEFAULT_CONSENT: ConsentState = {
  aiAnalysis: true,
  imageGeneration: true,
  patternDetection: true,
  clusterFormation: true,
};

/**
 * Hook to manage user consent preferences.
 * Persists to DB and provides real-time state.
 */
export function useConsent() {
  const { user } = useAuth();
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConsent(DEFAULT_CONSENT);
      setLoading(false);
      return;
    }

    supabase
      .from("user_consent" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setConsent({
            aiAnalysis: data.ai_analysis,
            imageGeneration: data.image_generation,
            patternDetection: data.pattern_detection,
            clusterFormation: data.cluster_formation,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const updateConsent = useCallback(
    async (key: keyof ConsentState, value: boolean) => {
      if (!user) return;

      const newConsent = { ...consent, [key]: value };
      setConsent(newConsent);

      const dbPayload: any = {
        user_id: user.id,
        ai_analysis: newConsent.aiAnalysis,
        image_generation: newConsent.imageGeneration,
        pattern_detection: newConsent.patternDetection,
        cluster_formation: newConsent.clusterFormation,
        updated_at: new Date().toISOString(),
      };

      // Upsert
      const { data: existing } = await (supabase
        .from("user_consent" as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle() as any);

      if (existing) {
        await (supabase
          .from("user_consent" as any)
          .update(dbPayload)
          .eq("user_id", user.id) as any);
      } else {
        await (supabase
          .from("user_consent" as any)
          .insert(dbPayload) as any);
      }

      // Log consent change
      await supabase.from("data_consent_log").insert({
        user_id: user.id,
        action: value ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
        scope: key,
        details: { timestamp: new Date().toISOString() },
      });
    },
    [user, consent]
  );

  return { consent, loading, updateConsent };
}
