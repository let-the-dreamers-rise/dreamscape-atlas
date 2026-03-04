export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string;
  generated_image: string;
  emotion: string;
  symbols: string[];
  themes: string[];
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
