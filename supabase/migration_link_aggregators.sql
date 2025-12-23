-- ==========================================
-- MIGRATION: Link Aggregators (Agregador de Links)
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- Tabela principal de agregadores de links
CREATE TABLE IF NOT EXISTS link_aggregators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Nome do agregador (ex: "Victor Diniz", "Maria Silva")
  slug TEXT UNIQUE NOT NULL, -- URL única (ex: "victor-diniz", "maria-silva")
  main_title TEXT DEFAULT 'Portfolio', -- Título principal com efeito Portfolio
  main_title_letter TEXT DEFAULT 'o', -- Letra a ser substituída pela animação
  profile_image TEXT, -- URL da imagem de perfil
  profile_name TEXT, -- Nome exibido no perfil
  homepage_button_enabled BOOLEAN DEFAULT true,
  homepage_button_title TEXT DEFAULT 'Visite nosso site',
  homepage_button_url TEXT, -- URL do botão para homepage
  links JSONB DEFAULT '[]'::jsonb, -- Array de LinkItem
  social_links JSONB DEFAULT '[]'::jsonb, -- Array de SocialLink
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_link_aggregators_slug ON link_aggregators(slug);
CREATE INDEX IF NOT EXISTS idx_link_aggregators_user_id ON link_aggregators(user_id);

-- RLS (Row Level Security)
ALTER TABLE link_aggregators ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler agregadores públicos (via slug)
CREATE POLICY "Link aggregators are viewable by everyone via slug"
  ON link_aggregators
  FOR SELECT
  USING (true);

-- Política: Usuários autenticados podem criar seus próprios agregadores
CREATE POLICY "Users can create their own link aggregators"
  ON link_aggregators
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios agregadores
CREATE POLICY "Users can update their own link aggregators"
  ON link_aggregators
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios agregadores
CREATE POLICY "Users can delete their own link aggregators"
  ON link_aggregators
  FOR DELETE
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_link_aggregators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_link_aggregators_updated_at
  BEFORE UPDATE ON link_aggregators
  FOR EACH ROW
  EXECUTE FUNCTION update_link_aggregators_updated_at();

