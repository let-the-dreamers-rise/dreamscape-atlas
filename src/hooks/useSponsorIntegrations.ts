import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for Storacha/Filecoin decentralized storage integration.
 * Uploads neural data exports to IPFS/Filecoin via edge function.
 */
export function useStoracha() {
  const [uploading, setUploading] = useState(false);
  const [lastCid, setLastCid] = useState<string | null>(null);

  const uploadToFilecoin = async (dreamData: any, metadata?: Record<string, any>) => {
    setUploading(true);
    try {
      const { data, error } = await supabase.functions.invoke("storacha-store", {
        body: { dreamData, metadata },
      });
      if (error) throw error;
      setLastCid(data.cid);
      toast.success(`Stored on IPFS/Filecoin — CID: ${data.cid?.slice(0, 12)}...`);
      return data;
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload to Storacha");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadToFilecoin, uploading, lastCid };
}

/**
 * Hook for Lit Protocol encryption integration.
 * Encrypts dream data with programmable access control conditions.
 */
export function useLitProtocol() {
  const [encrypting, setEncrypting] = useState(false);

  const encryptDreamData = async (dreamData: any, accessConditions?: any[]) => {
    setEncrypting(true);
    try {
      const { data, error } = await supabase.functions.invoke("lit-encrypt", {
        body: { dreamData, accessConditions },
      });
      if (error) throw error;
      toast.success("Neural data encrypted via Lit Protocol");
      return data;
    } catch (err: any) {
      toast.error(err?.message || "Failed to encrypt via Lit Protocol");
      throw err;
    } finally {
      setEncrypting(false);
    }
  };

  return { encryptDreamData, encrypting };
}

/**
 * Hook for NEAR Protocol blockchain attestation.
 * Stores collective pattern hashes on-chain for verifiable integrity.
 */
export function useNearAttestation() {
  const [attesting, setAttesting] = useState(false);
  const [lastAttestation, setLastAttestation] = useState<any>(null);

  const storeAttestation = async (patternData: any[]) => {
    setAttesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("near-attestation", {
        body: { patternData },
      });
      if (error) throw error;
      setLastAttestation(data.attestation);
      toast.success("Pattern hash attested on NEAR Protocol");
      return data;
    } catch (err: any) {
      toast.error(err?.message || "Failed to store attestation on NEAR");
      throw err;
    } finally {
      setAttesting(false);
    }
  };

  return { storeAttestation, attesting, lastAttestation };
}

/**
 * Hook for Impulse AI cognitive analysis.
 * Provides deeper ML-powered dream analysis via Impulse AI's inference API.
 */
export function useImpulseAI() {
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  const analyzeDream = async (params: {
    symbols: string[];
    emotion: string;
    themes: string[];
    description: string;
  }) => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("impulse-analyze", {
        body: params,
      });
      if (error) throw error;
      setLastAnalysis(data.analysis);
      return data;
    } catch (err: any) {
      toast.error(err?.message || "Impulse AI analysis failed");
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  return { analyzeDream, analyzing, lastAnalysis };
}
