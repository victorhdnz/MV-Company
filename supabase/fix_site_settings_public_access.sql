-- ==========================================
-- CORRIGIR ACESSO PÚBLICO À TABELA site_settings
-- ==========================================
-- Este script garante que usuários não autenticados (anon) 
-- possam ler os dados de site_settings para exibir a homepage
-- ==========================================
-- INSTRUÇÕES: Execute este script no SQL Editor do Supabase Dashboard
-- ==========================================

-- 1. Verificar políticas RLS existentes
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'site_settings';
  
  RAISE NOTICE 'Políticas RLS encontradas: %', policy_count;
END $$;

-- 2. Remover TODAS as políticas existentes de SELECT para recriar corretamente
DO $$
DECLARE
  policy_name TEXT;
BEGIN
  FOR policy_name IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings'
    AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_settings', policy_name);
    RAISE NOTICE 'Removida política SELECT: %', policy_name;
  END LOOP;
END $$;

-- 3. Criar política de SELECT que permite acesso PÚBLICO (anon) e autenticado
DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
CREATE POLICY "site_settings_public_read"
ON public.site_settings
FOR SELECT
TO authenticated, anon
USING (true);

DO $$
BEGIN
  RAISE NOTICE '✓ Política de leitura pública criada para site_settings';
END $$;

-- 4. Verificar se RLS está habilitado
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings'
  ) THEN
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✓ RLS habilitado na tabela site_settings';
  END IF;
END $$;

-- 5. Verificar políticas de UPDATE e INSERT (manter apenas para admins)
DO $$
DECLARE
  update_policy_exists BOOLEAN;
  insert_policy_exists BOOLEAN;
BEGIN
  -- Verificar política de UPDATE
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings'
    AND cmd = 'UPDATE'
  ) INTO update_policy_exists;
  
  IF NOT update_policy_exists THEN
    CREATE POLICY "site_settings_admin_update"
    ON public.site_settings
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'editor')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'editor')
      )
    );
    RAISE NOTICE '✓ Política de UPDATE criada para admins/editores';
  ELSE
    RAISE NOTICE '✓ Política de UPDATE já existe';
  END IF;
  
  -- Verificar política de INSERT
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'site_settings'
    AND cmd = 'INSERT'
  ) INTO insert_policy_exists;
  
  IF NOT insert_policy_exists THEN
    CREATE POLICY "site_settings_admin_insert"
    ON public.site_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'editor')
      )
    );
    RAISE NOTICE '✓ Política de INSERT criada para admins/editores';
  ELSE
    RAISE NOTICE '✓ Política de INSERT já existe';
  END IF;
END $$;

-- 6. Testar acesso público (simulação)
DO $$
DECLARE
  test_count INTEGER;
BEGIN
  -- Tentar ler como anon (simulado)
  SELECT COUNT(*) INTO test_count
  FROM public.site_settings
  WHERE key = 'general';
  
  RAISE NOTICE '✓ Teste de leitura: % registro(s) encontrado(s) para key = ''general''', test_count;
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✓ CORREÇÃO DE ACESSO PÚBLICO CONCLUÍDA!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Agora usuários não autenticados podem ler site_settings';
  RAISE NOTICE '==========================================';
END $$;

