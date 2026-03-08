import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Check user consent before proceeding
    const authHeader = req.headers.get("authorization");
    let aiAnalysisAllowed = true;
    let imageGenerationAllowed = true;

    if (authHeader) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: consent } = await supabase
            .from("user_consent")
            .select("ai_analysis, image_generation")
            .eq("user_id", user.id)
            .maybeSingle();

          if (consent) {
            aiAnalysisAllowed = consent.ai_analysis;
            imageGenerationAllowed = consent.image_generation;
          }
        }
      } catch (e) {
        console.error("Consent check failed, proceeding with defaults:", e);
      }
    }

    // If AI analysis is revoked, return minimal data
    if (!aiAnalysisAllowed) {
      return new Response(
        JSON.stringify({
          symbols: [],
          emotion: "Unanalyzed",
          themes: [],
          generated_image: null,
          consent_blocked: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a dream analyst. Given a dream description, extract structured data. Return ONLY a JSON object with these fields:
- symbols: array of 3-6 key dream symbols (single words or short phrases like "flying", "ocean", "mirror")
- emotion: the primary emotion (one word like "wonder", "fear", "nostalgia", "awe", "joy", "melancholy")
- themes: array of 2-4 abstract themes (like "freedom", "exploration", "identity", "transformation")
- image_prompt: a detailed prompt for generating a surreal dream visualization image (include "surreal dream scene", cinematic lighting, dreamlike atmosphere, vivid colors)

Return ONLY valid JSON, no markdown, no explanation.`,
          },
          {
            role: "user",
            content: `Dream title: "${title}"\n\nDream description: "${description}"`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_dream",
              description: "Extract structured dream analysis data",
              parameters: {
                type: "object",
                properties: {
                  symbols: { type: "array", items: { type: "string" }, description: "3-6 key dream symbols" },
                  emotion: { type: "string", description: "Primary emotion of the dream" },
                  themes: { type: "array", items: { type: "string" }, description: "2-4 abstract themes" },
                  image_prompt: { type: "string", description: "Detailed image generation prompt" },
                },
                required: ["symbols", "emotion", "themes", "image_prompt"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_dream" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Contribute to collective intelligence (anonymous aggregate)
    try {
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      for (const symbol of analysis.symbols) {
        const { data: existing } = await adminClient
          .from("collective_patterns")
          .select("id, global_frequency, emotion_associations")
          .eq("symbol_name", symbol)
          .maybeSingle();

        if (existing) {
          const emotions = (existing.emotion_associations as Record<string, number>) || {};
          emotions[analysis.emotion] = (emotions[analysis.emotion] || 0) + 1;
          await adminClient
            .from("collective_patterns")
            .update({ global_frequency: existing.global_frequency + 1, emotion_associations: emotions, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await adminClient
            .from("collective_patterns")
            .insert({
              symbol_name: symbol,
              global_frequency: 1,
              emotion_associations: { [analysis.emotion]: 1 },
            });
        }
      }
    } catch (collectiveErr) {
      console.error("Collective intelligence update failed:", collectiveErr);
    }

    // Generate image only if consent allows
    let generated_image: string | null = null;
    if (imageGenerationAllowed) {
      try {
        const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{ role: "user", content: analysis.image_prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          generated_image = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
        }
      } catch (imgErr) {
        console.error("Image generation failed:", imgErr);
      }
    }

    return new Response(
      JSON.stringify({
        symbols: analysis.symbols,
        emotion: analysis.emotion,
        themes: analysis.themes,
        generated_image,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-dream error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
