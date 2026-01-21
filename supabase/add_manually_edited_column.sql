-- ==========================================
-- ADICIONAR COLUNAS PARA MARCAR EDIÇÃO MANUAL
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- Adicionar coluna manually_edited se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'manually_edited'
  ) THEN
    ALTER TABLE subscriptions 
    ADD COLUMN manually_edited BOOLEAN DEFAULT FALSE;
    
    RAISE NOTICE 'Coluna manually_edited adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna manually_edited já existe';
  END IF;
END $$;

-- Adicionar coluna manually_edited_at se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'subscriptions' 
    AND column_name = 'manually_edited_at'
  ) THEN
    ALTER TABLE subscriptions 
    ADD COLUMN manually_edited_at TIMESTAMPTZ;
    
    RAISE NOTICE 'Coluna manually_edited_at adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna manually_edited_at já existe';
  END IF;
END $$;

-- Verificar resultados
SELECT 
  id,
  user_id,
  plan_id,
  billing_cycle,
  stripe_subscription_id,
  manually_edited,
  manually_edited_at,
  current_period_start,
  current_period_end,
  status
FROM subscriptions
WHERE status = 'active' OR status IS NULL
ORDER BY created_at DESC
LIMIT 10;

