-- ==========================================
-- ATUALIZAR TEXTO DE SELEÇÃO DE SERVIÇOS NOS TERMOS
-- ==========================================
-- Este script atualiza a seção 3.1 dos Termos de Serviços Personalizados
-- para remover a menção sobre serviços começarem selecionados
-- ==========================================
-- INSTRUÇÕES: Execute este script no SQL Editor do Supabase Dashboard
-- ==========================================

UPDATE public.site_terms
SET content = REPLACE(
  content,
  '### 3.1. Seleção de Serviços
O cliente pode selecionar quais serviços deseja contratar durante o processo de checkout. Todos os serviços começam selecionados por padrão, mas o cliente pode desmarcar os que não deseja antes de finalizar a contratação.',
  '### 3.1. Seleção de Serviços
O cliente pode selecionar quais serviços deseja contratar durante o processo de checkout. O cliente deve marcar os serviços desejados antes de finalizar a contratação. O preço total será calculado automaticamente com base nos serviços selecionados.'
)
WHERE key = 'termos-servicos'
  AND content LIKE '%Todos os serviços começam selecionados por padrão%';

-- Verificar se a atualização foi bem-sucedida
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  IF updated_count > 0 THEN
    RAISE NOTICE '✓ Seção 3.1 atualizada com sucesso nos Termos de Serviços Personalizados.';
  ELSE
    RAISE NOTICE 'ℹ A seção 3.1 já está atualizada ou o termo não foi encontrado.';
  END IF;
END $$;

