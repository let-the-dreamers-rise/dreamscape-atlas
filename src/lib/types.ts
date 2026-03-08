export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  generated_image: string;
  emotion: string;
  symbols: string[];
  themes: string[];
  isUserDream?: boolean;
}

export interface Symbol {
  id: string;
  name: string;
  frequency: number;
}

export interface DreamSymbolRelation {
  dream_id: string;
  symbol_id: string;
}

export interface MemoryCluster {
  id: string;
  name: string;
  symbols: string[];
  dreamIds: string[];
  strength: number;
  description: string;
  color: string;
}

export interface ConsentRecord {
  id: string;
  action: string;
  scope: string;
  details: Record<string, unknown>;
  created_at: string;
}
