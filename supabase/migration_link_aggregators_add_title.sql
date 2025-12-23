-- ==========================================
-- MIGRATION: Adicionar campos de título principal
-- Execute este script no SQL Editor do Supabase se já tiver criado a tabela
-- ==========================================

-- Adicionar colunas para título principal (se ainda não existirem)
ALTER TABLE link_aggregators 
ADD COLUMN IF NOT EXISTS main_title TEXT DEFAULT 'Portfolio';

ALTER TABLE link_aggregators 
ADD COLUMN IF NOT EXISTS main_title_letter TEXT DEFAULT 'o';

