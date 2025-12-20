-- ==========================================
-- MIGRAÇÃO: Adicionar campo homepage_content
-- Execute este script no SQL Editor do Supabase
-- Data: 2024
-- ==========================================

-- Adicionar campo homepage_content na tabela site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS homepage_content JSONB DEFAULT '{}';

-- Comentário
COMMENT ON COLUMN site_settings.homepage_content IS 'Conteúdo editável da homepage (hero, serviços, comparação, contato)';

-- Verificar se foi adicionado corretamente
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'homepage_content'
  ) THEN
    RAISE NOTICE 'Campo homepage_content adicionado com sucesso!';
  ELSE
    RAISE EXCEPTION 'Erro ao adicionar campo homepage_content';
  END IF;
END $$;

