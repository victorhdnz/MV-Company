-- ==========================================
-- MIGRAÇÃO: Adicionar campo loading_logo
-- Execute este script no SQL Editor do Supabase
-- Data: 2024
-- ==========================================

-- Adicionar campo loading_logo na tabela site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS loading_logo TEXT;

-- Comentário
COMMENT ON COLUMN site_settings.loading_logo IS 'URL da logo que aparece dentro do círculo de carregamento (upload via Cloudinary)';

-- Verificar se foi adicionado corretamente
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'loading_logo'
  ) THEN
    RAISE NOTICE 'Campo loading_logo adicionado com sucesso!';
  ELSE
    RAISE EXCEPTION 'Erro ao adicionar campo loading_logo';
  END IF;
END $$;

