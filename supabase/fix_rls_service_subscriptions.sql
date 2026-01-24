-- ==========================================
-- CORRIGIR RLS DA TABELA service_subscriptions
-- ==========================================
-- Este script adiciona políticas de INSERT e UPDATE para admins
-- ==========================================
-- INSTRUÇÕES: Execute este script no SQL Editor do Supabase Dashboard
-- ==========================================

-- Admin pode inserir assinaturas de serviço
DROP POLICY IF EXISTS "service_subscriptions_insert_admin" ON public.service_subscriptions;
CREATE POLICY "service_subscriptions_insert_admin"
ON public.service_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- Admin pode atualizar assinaturas de serviço
DROP POLICY IF EXISTS "service_subscriptions_update_admin" ON public.service_subscriptions;
CREATE POLICY "service_subscriptions_update_admin"
ON public.service_subscriptions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- Admin pode deletar assinaturas de serviço
DROP POLICY IF EXISTS "service_subscriptions_delete_admin" ON public.service_subscriptions;
CREATE POLICY "service_subscriptions_delete_admin"
ON public.service_subscriptions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- Políticas RLS de INSERT, UPDATE e DELETE para admins adicionadas com sucesso!
