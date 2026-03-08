
CREATE TABLE public.memory_clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  symbols TEXT[] NOT NULL DEFAULT '{}',
  dream_ids UUID[] NOT NULL DEFAULT '{}',
  strength REAL NOT NULL DEFAULT 0.0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.memory_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clusters" ON public.memory_clusters FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own clusters" ON public.memory_clusters FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clusters" ON public.memory_clusters FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clusters" ON public.memory_clusters FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.data_consent_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  scope TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.data_consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consent logs" ON public.data_consent_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own consent logs" ON public.data_consent_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
