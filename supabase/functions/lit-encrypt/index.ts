import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Lit Protocol Integration — Programmable Encryption for Neural Data
 * 
 * Encrypts dream data using Lit Protocol's decentralized key management,
 * enabling programmable access control conditions. Only the dream owner
 * (verified via wallet signature or custom auth) can decrypt.
 * 
 * This implements the "Neural Data Sovereignty" principle:
 * cognitive data is encrypted at the application layer with
 * user-controlled access conditions — not just server-side ACLs.
 * 
 * Sponsor: Lit Protocol
 * Track: Neurotech / Infrastructure & Digital Rights
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

    const LIT_API_KEY = Deno.env.get("LIT_API_KEY");
    if (!LIT_API_KEY) {
      return new Response(JSON.stringify({ error: "LIT_API_KEY is not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { dreamData, accessConditions } = await req.json();
    if (!dreamData) {
      return new Response(JSON.stringify({ error: "Missing dreamData" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Define Lit Protocol Access Control Conditions
    // Default: Only the authenticated user can decrypt their own neural data
    const litAccessControlConditions = accessConditions || [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: user.id, // Maps DreamOS user to access condition
        },
      },
    ];

    // Encrypt via Lit Protocol's encryption API
    const encryptResponse = await fetch("https://apis.getlit.dev/datil-dev/encrypt", {
      method: "POST",
      headers: {
        "api-key": LIT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataToEncrypt: JSON.stringify(dreamData),
        accessControlConditions: litAccessControlConditions,
        chain: "ethereum",
      }),
    });

    if (!encryptResponse.ok) {
      const errText = await encryptResponse.text();
      console.error("Lit Protocol encryption failed:", encryptResponse.status, errText);
      throw new Error(`Lit Protocol encryption failed [${encryptResponse.status}]: ${errText}`);
    }

    const encryptResult = await encryptResponse.json();

    // Log to consent audit trail
    await supabase.from("data_consent_log").insert({
      user_id: user.id,
      action: "DATA_ENCRYPTED",
      scope: "lit_protocol",
      details: {
        provider: "Lit Protocol (Datil Network)",
        encryption: "AES-256-GCM",
        accessControl: "programmable",
        conditionCount: litAccessControlConditions.length,
        timestamp: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        encrypted: true,
        ciphertext: encryptResult.ciphertext,
        dataToEncryptHash: encryptResult.dataToEncryptHash,
        accessControlConditions: litAccessControlConditions,
        provider: "Lit Protocol",
        network: "Datil",
        encryption: "AES-256-GCM with threshold cryptography",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("lit-encrypt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
