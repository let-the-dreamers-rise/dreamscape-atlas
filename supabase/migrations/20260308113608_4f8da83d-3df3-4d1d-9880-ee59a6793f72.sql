
-- Collective intelligence: aggregate anonymous dream stats
CREATE TABLE public.collective_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol_name text NOT NULL,
  global_frequency integer NOT NULL DEFAULT 1,
  emotion_associations jsonb DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(symbol_name)
);

ALTER TABLE public.collective_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collective patterns"
ON public.collective_patterns
FOR SELECT
TO anon, authenticated
USING (true);

-- Add consent_preferences to track actual consent state per user
CREATE TABLE public.user_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ai_analysis boolean NOT NULL DEFAULT true,
  image_generation boolean NOT NULL DEFAULT true,
  pattern_detection boolean NOT NULL DEFAULT true,
  cluster_formation boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consent"
ON public.user_consent
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own consent"
ON public.user_consent
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consent"
ON public.user_consent
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.collective_patterns;
