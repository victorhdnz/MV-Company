-- ==========================================
-- DELETAR TERMOS ANTIGOS DO PROJETO ANTERIOR
-- ==========================================
-- Este script deleta os termos "Política de Entrega" e "Trocas e Devoluções"
-- que são do projeto antigo e não são mais necessários
-- ==========================================
-- INSTRUÇÕES: Execute este script no SQL Editor do Supabase Dashboard
-- ==========================================

-- Verificar se os termos existem antes de deletar
SELECT 
  key,
  title,
  created_at,
  updated_at
FROM site_terms
WHERE key IN ('politica-entrega', 'trocas-devolucoes');

-- Deletar os termos antigos
DELETE FROM site_terms
WHERE key IN ('politica-entrega', 'trocas-devolucoes');

-- Verificar se foram deletados
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Termos deletados com sucesso!'
    ELSE '✗ Ainda existem termos: ' || string_agg(key, ', ')
  END as resultado
FROM site_terms
WHERE key IN ('politica-entrega', 'trocas-devolucoes');

-- Mostrar todos os termos restantes
SELECT 
  key,
  title,
  created_at
FROM site_terms
ORDER BY key;

