import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Impulse AI Integration — Autonomous ML for Cognitive Interfaces
 * 
 * Provides decentralized AI-powered dream pattern analysis using Impulse AI's
 * ML inference pipeline. Complements the primary analysis by adding:
 * - Archetypal pattern classification (Jungian framework)
 * - Emotional valence scoring (continuous scale)
 * - Memory consolidation prediction (likelihood of long-term encoding)
 * - Cross-cultural symbol mapping
 * 
 * Sponsor: Impulse AI
 * Track: Neurotech / AI & Robotics
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check consent
    const { data: consent } = await supabase
      .from("user_consent")
      .select("ai_analysis")
      .eq("user_id", user.id)
      .maybeSingle();

    if (consent && !consent.ai_analysis) {
      return new Response(JSON.stringify({
        error: "AI analysis consent not granted",
        consent_blocked: true,
      }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const IMPULSE_API_KEY = Deno.env.get("IMPULSE_API_KEY");
    if (!IMPULSE_API_KEY) {
      return new Response(JSON.stringify({ error: "IMPULSE_API_KEY is not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { symbols, emotion, themes, description } = await req.json();
    if (!symbols || !description) {
      return new Response(JSON.stringify({ error: "Missing required fields (symbols, description)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Impulse AI for deeper cognitive analysis
    const impulseResponse = await fetch("https://api.impulse.ai/v1/inference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${IMPULSE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "cognitive-pattern-v1",
        input: {
          text: description,
          metadata: {
            symbols,
            primary_emotion: emotion,
            themes,
            domain: "dream_analysis",
            framework: "jungian_archetypal",
          },
        },
        tasks: [
          {
            type: "classification",
            label: "archetype_detection",
            categories: [
              "The Hero", "The Shadow", "The Anima/Animus", "The Self",
              "The Trickster", "The Great Mother", "The Wise Old Man",
              "The Child", "The Maiden", "The Persona",
            ],
          },
          {
            type: "regression",
            label: "emotional_valence",
            range: [-1.0, 1.0],
          },
          {
            type: "regression",
            label: "consolidation_likelihood",
            range: [0.0, 1.0],
          },
          {
            type: "embedding",
            label: "dream_vector",
            dimensions: 128,
          },
        ],
      }),
    });

    if (!impulseResponse.ok) {
      const errText = await impulseResponse.text();
      console.error("Impulse AI inference failed:", impulseResponse.status, errText);
      throw new Error(`Impulse AI inference failed [${impulseResponse.status}]: ${errText}`);
    }

    const impulseResult = await impulseResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        provider: "Impulse AI",
        analysis: {
          archetypes: impulseResult.results?.archetype_detection || [],
          emotional_valence: impulseResult.results?.emotional_valence ?? 0,
          consolidation_likelihood: impulseResult.results?.consolidation_likelihood ?? 0.5,
          dream_vector: impulseResult.results?.dream_vector || null,
          cross_cultural_symbols: impulseResult.results?.cross_cultural || [],
        },
        metadata: {
          model: "cognitive-pattern-v1",
          inference_time_ms: impulseResult.metadata?.inference_time_ms || 0,
          framework: "Jungian Archetypal Analysis",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("impulse-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
