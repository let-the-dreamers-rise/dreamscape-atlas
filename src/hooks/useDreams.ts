import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dream, Symbol } from "@/lib/types";
import { mockDreams, mockSymbols } from "@/lib/dreamData";

/**
 * Hook that fetches real user dreams from the DB and merges with mock demo data.
 * If no user is logged in, returns only demo data.
 */
export function useDreams() {
  const [userDreams, setUserDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDreams = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserDreams([]);
        setLoading(false);
        return;
      }

      // Fetch dreams
      const { data: dreams, error } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching dreams:", error);
        setLoading(false);
        return;
      }

      // Fetch symbols for each dream
      const dreamIds = (dreams || []).map((d) => d.id);
      let symbolMap: Record<string, string[]> = {};

      if (dreamIds.length > 0) {
        const { data: dreamSymbols } = await supabase
          .from("dream_symbols")
          .select("dream_id, symbol_id")
          .in("dream_id", dreamIds);

        if (dreamSymbols && dreamSymbols.length > 0) {
          const symbolIds = [...new Set(dreamSymbols.map((ds) => ds.symbol_id))];
          const { data: symbols } = await supabase
            .from("symbols")
            .select("id, name")
            .in("id", symbolIds);

          const symbolNameMap = new Map((symbols || []).map((s) => [s.id, s.name]));

          for (const ds of dreamSymbols) {
            const name = symbolNameMap.get(ds.symbol_id);
            if (name) {
              if (!symbolMap[ds.dream_id]) symbolMap[ds.dream_id] = [];
              symbolMap[ds.dream_id].push(name);
            }
          }
        }
      }

      const mapped: Dream[] = (dreams || []).map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        date: d.date,
        generated_image: d.generated_image || "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",
        emotion: d.emotion || "Unknown",
        symbols: symbolMap[d.id] || [],
        themes: (d.themes as string[]) || [],
        isUserDream: true,
      }));

      setUserDreams(mapped);
    } catch (err) {
      console.error("Error in useDreams:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDreams();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserDreams();
    });

    return () => subscription.unsubscribe();
  }, [fetchUserDreams]);

  // Show mock data for unauthenticated users and demo account; hide for regular signed-in users
  const [showMockData, setShowMockData] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const isDemo = user?.email === "demo@dreamos.app";
      setShowMockData(!user || isDemo);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDemo = session?.user?.email === "demo@dreamos.app";
      setShowMockData(!session?.user || isDemo);
    });
    return () => subscription.unsubscribe();
  }, []);

  const allDreams = showMockData ? [...userDreams, ...mockDreams] : userDreams;

  return { allDreams, userDreams, demoDreams: mockDreams, loading, refetch: fetchUserDreams };
}

/**
 * Hook that builds a symbol list from dreams.
 * Only merges mock symbols for unauthenticated/demo users.
 */
export function useSymbols(allDreams: Dream[]) {
  const [includeMock, setIncludeMock] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const isDemo = user?.email === "demo@dreamos.app";
      setIncludeMock(!user || isDemo);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDemo = session?.user?.email === "demo@dreamos.app";
      setIncludeMock(!session?.user || isDemo);
    });
    return () => subscription.unsubscribe();
  }, []);

  const symbolFrequency = new Map<string, number>();

  for (const dream of allDreams) {
    for (const sym of dream.symbols) {
      symbolFrequency.set(sym, (symbolFrequency.get(sym) || 0) + 1);
    }
  }

  // Only merge mock symbols for unauthenticated/demo users
  if (includeMock) {
    for (const ms of mockSymbols) {
      const current = symbolFrequency.get(ms.name) || 0;
      if (current < ms.frequency) {
        symbolFrequency.set(ms.name, ms.frequency);
      }
    }
  }

  const allSymbols: Symbol[] = Array.from(symbolFrequency.entries()).map(([name, frequency], i) => ({
    id: mockSymbols.find((s) => s.name === name)?.id || `us-${i}`,
    name,
    frequency,
  }));

  return allSymbols;
}
