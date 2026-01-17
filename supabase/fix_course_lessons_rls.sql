-- ==========================================
-- CORRIGIR POLÍTICAS RLS PARA COURSE_LESSONS
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- Remover políticas conflitantes
DROP POLICY IF EXISTS "Course lessons are viewable by everyone" ON course_lessons;
DROP POLICY IF EXISTS "Course lessons are editable by admins" ON course_lessons;

-- Criar política única para visualização: todos podem ver lessons de cursos publicados
CREATE POLICY "Everyone can view lessons from published courses" ON course_lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_lessons.course_id
      AND courses.is_published = true
    )
  );

-- Criar política para admins gerenciarem lessons
CREATE POLICY "Admins can manage course lessons" ON course_lessons
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
WHERE tablename = 'course_lessons'
ORDER BY policyname;

