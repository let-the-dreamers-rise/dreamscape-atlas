import { Dream, Symbol } from "@/lib/types";

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  type: "trend" | "correlation" | "cluster" | "frequency";
  color: "primary" | "cyan" | "rose" | "amber";
}

/**
 * Analyze dreams and generate pattern insights.
 */
export function generatePatternInsights(dreams: Dream[], symbols: Symbol[]): PatternInsight[] {
  const insights: PatternInsight[] = [];

  // 1. Symbol frequency trends
  const sortedSymbols = [...symbols].sort((a, b) => b.frequency - a.frequency);
  if (sortedSymbols.length > 0) {
    const top = sortedSymbols[0];
    insights.push({
      id: "freq-top",
      title: `"${top.name}" is your most recurring symbol`,
      description: `Appearing ${top.frequency} times across your dreams, "${top.name}" is a dominant motif in your subconscious landscape.`,
      type: "frequency",
      color: "primary",
    });
  }

  // 2. Emotion-symbol correlation
  const emotionSymbolMap = new Map<string, Map<string, number>>();
  for (const dream of dreams) {
    if (!dream.emotion) continue;
    if (!emotionSymbolMap.has(dream.emotion)) {
      emotionSymbolMap.set(dream.emotion, new Map());
    }
    const symMap = emotionSymbolMap.get(dream.emotion)!;
    for (const sym of dream.symbols) {
      symMap.set(sym, (symMap.get(sym) || 0) + 1);
    }
  }

  for (const [emotion, symMap] of emotionSymbolMap) {
    let maxSym = "";
    let maxCount = 0;
    for (const [sym, count] of symMap) {
      if (count > maxCount) {
        maxSym = sym;
        maxCount = count;
      }
    }
    if (maxCount >= 2) {
      insights.push({
        id: `corr-${emotion}-${maxSym}`,
        title: `"${maxSym}" correlates with "${emotion}"`,
        description: `The symbol "${maxSym}" appears ${maxCount} times in dreams tagged with "${emotion}", suggesting a deep emotional connection.`,
        type: "correlation",
        color: "cyan",
      });
    }
  }

  // 3. Monthly trends
  const now = new Date();
  const thisMonth = dreams.filter((d) => {
    const date = new Date(d.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const lastMonth = dreams.filter((d) => {
    const date = new Date(d.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1);
    return date.getMonth() === lm.getMonth() && date.getFullYear() === lm.getFullYear();
  });

  if (thisMonth.length > 0 && lastMonth.length > 0) {
    const thisSyms = new Map<string, number>();
    for (const d of thisMonth) for (const s of d.symbols) thisSyms.set(s, (thisSyms.get(s) || 0) + 1);
    const lastSyms = new Map<string, number>();
    for (const d of lastMonth) for (const s of d.symbols) lastSyms.set(s, (lastSyms.get(s) || 0) + 1);

    for (const [sym, count] of thisSyms) {
      const prev = lastSyms.get(sym) || 0;
      if (prev > 0 && count >= prev * 2) {
        insights.push({
          id: `trend-${sym}`,
          title: `"${sym}" dreams increased ${Math.round(count / prev)}× this month`,
          description: `You dreamt about "${sym}" ${count} times this month compared to ${prev} last month — a significant increase.`,
          type: "trend",
          color: "rose",
        });
      }
    }
  }

  // 4. Recurring clusters (symbols that always appear together)
  const pairCount = new Map<string, number>();
  for (const dream of dreams) {
    const syms = dream.symbols;
    for (let i = 0; i < syms.length; i++) {
      for (let j = i + 1; j < syms.length; j++) {
        const key = [syms[i], syms[j]].sort().join(" + ");
        pairCount.set(key, (pairCount.get(key) || 0) + 1);
      }
    }
  }

  const sortedPairs = [...pairCount.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedPairs.length > 0 && sortedPairs[0][1] >= 2) {
    const [pair, count] = sortedPairs[0];
    insights.push({
      id: `cluster-${pair}`,
      title: `${pair} form a recurring cluster`,
      description: `These symbols appeared together in ${count} dreams, suggesting they're deeply connected in your subconscious.`,
      type: "cluster",
      color: "amber",
    });
  }

  // 5. Emotion distribution insight
  const emotionCounts = new Map<string, number>();
  for (const dream of dreams) {
    if (dream.emotion) {
      emotionCounts.set(dream.emotion, (emotionCounts.get(dream.emotion) || 0) + 1);
    }
  }
  const topEmotion = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topEmotion && topEmotion[1] >= 2) {
    insights.push({
      id: `emotion-dom`,
      title: `"${topEmotion[0]}" dominates your dreamscape`,
      description: `${topEmotion[1]} out of ${dreams.length} dreams carry the emotion "${topEmotion[0]}", making it the prevailing mood of your subconscious.`,
      type: "frequency",
      color: "primary",
    });
  }

  return insights.slice(0, 6);
}
