
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Dreams table
CREATE TABLE public.dreams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  generated_image TEXT,
  emotion TEXT,
  themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dreams" ON public.dreams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own dreams" ON public.dreams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dreams" ON public.dreams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dreams" ON public.dreams FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_dreams_updated_at BEFORE UPDATE ON public.dreams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Symbols table
CREATE TABLE public.symbols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE public.symbols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own symbols" ON public.symbols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own symbols" ON public.symbols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own symbols" ON public.symbols FOR UPDATE USING (auth.uid() = user_id);

-- Dream-Symbol relation
CREATE TABLE public.dream_symbols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dream_id UUID NOT NULL REFERENCES public.dreams(id) ON DELETE CASCADE,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  UNIQUE(dream_id, symbol_id)
);

ALTER TABLE public.dream_symbols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dream_symbols" ON public.dream_symbols FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.dreams WHERE dreams.id = dream_symbols.dream_id AND dreams.user_id = auth.uid())
);
CREATE POLICY "Users can create own dream_symbols" ON public.dream_symbols FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.dreams WHERE dreams.id = dream_symbols.dream_id AND dreams.user_id = auth.uid())
);

-- Indexes
CREATE INDEX idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX idx_dreams_date ON public.dreams(date DESC);
CREATE INDEX idx_symbols_user_id ON public.symbols(user_id);
CREATE INDEX idx_dream_symbols_dream ON public.dream_symbols(dream_id);
CREATE INDEX idx_dream_symbols_symbol ON public.dream_symbols(symbol_id);
