-- ==========================================
-- CORRIGIR POLÍTICAS RLS PARA COURSES
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- Remover políticas conflitantes
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Everyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Courses are editable by admins" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

-- Criar política única para visualização: todos podem ver cursos publicados
CREATE POLICY "Everyone can view published courses" ON courses
  FOR SELECT
  USING (is_published = true);

-- Criar política para admins gerenciarem cursos
CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'courses'
ORDER BY policyname;

