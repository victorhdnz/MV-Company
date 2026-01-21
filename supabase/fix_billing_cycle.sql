-- ==========================================
-- CORRIGIR BILLING_CYCLE DAS ASSINATURAS
-- Execute este SQL no Supabase SQL Editor
-- ==========================================
-- 
-- Este script corrige o billing_cycle das assinaturas baseado na duração do período
-- e também atualiza baseado no stripe_price_id quando disponível

-- 1. Atualizar billing_cycle baseado na duração do período (para assinaturas sem stripe_price_id)
UPDATE subscriptions
SET billing_cycle = CASE
  WHEN current_period_end IS NOT NULL AND current_period_start IS NOT NULL THEN
    CASE
      WHEN EXTRACT(EPOCH FROM (current_period_end - current_period_start)) > 2592000 THEN 'annual' -- Mais de 30 dias
      ELSE 'monthly'
    END
  ELSE billing_cycle
END,
updated_at = NOW()
WHERE billing_cycle IS NULL 
   OR (stripe_subscription_id IS NULL OR stripe_subscription_id = '');

-- 2. Atualizar billing_cycle baseado no stripe_price_id (para assinaturas do Stripe)
UPDATE subscriptions
SET billing_cycle = CASE
  WHEN stripe_price_id IN ('price_1SpjHyJmSvvqlkSQRBubxB7K', 'price_1SpjKSJmSvvqlkSQlr8jNDTf') THEN 'annual'
  WHEN stripe_price_id IN ('price_1SpjGIJmSvvqlkSQGIpVMt0H', 'price_1SpjJIJmSvvqlkSQpBHztwk6') THEN 'monthly'
  ELSE billing_cycle
END,
updated_at = NOW()
WHERE stripe_price_id IS NOT NULL 
  AND stripe_price_id != ''
  AND stripe_price_id IN (
    'price_1SpjGIJmSvvqlkSQGIpVMt0H', -- Essencial Mensal
    'price_1SpjHyJmSvvqlkSQRBubxB7K', -- Essencial Anual
    'price_1SpjJIJmSvvqlkSQpBHztwk6', -- Pro Mensal
    'price_1SpjKSJmSvvqlkSQlr8jNDTf'  -- Pro Anual
  );

-- 3. Garantir que todas as assinaturas tenham billing_cycle
UPDATE subscriptions
SET billing_cycle = 'monthly',
    updated_at = NOW()
WHERE billing_cycle IS NULL OR billing_cycle = '';

-- Verificar resultados
SELECT 
  id,
  user_id,
  plan_id,
  billing_cycle,
  stripe_price_id,
  stripe_subscription_id,
  current_period_start,
  current_period_end,
  CASE
    WHEN current_period_end IS NOT NULL AND current_period_start IS NOT NULL THEN
      EXTRACT(EPOCH FROM (current_period_end - current_period_start)) / 86400
    ELSE NULL
  END as days_in_period,
  status
FROM subscriptions
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;

