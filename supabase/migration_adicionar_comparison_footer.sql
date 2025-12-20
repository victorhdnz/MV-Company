-- Migração: Adicionar coluna comparison_footer na tabela site_settings
-- Data: 2024
-- Descrição: Adiciona campo JSONB para armazenar configurações do rodapé do comparador

-- Verificar se a coluna já existe antes de adicionar
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'comparison_footer'
  ) THEN
    ALTER TABLE site_settings 
    ADD COLUMN comparison_footer JSONB DEFAULT NULL;
    
    RAISE NOTICE 'Coluna comparison_footer adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna comparison_footer já existe';
  END IF;
END $$;

