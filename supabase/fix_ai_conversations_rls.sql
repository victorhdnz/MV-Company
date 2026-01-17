-- ==========================================
-- CORRIGIR POLÍTICAS RLS PARA AI_CONVERSATIONS E AI_MESSAGES
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- Remover políticas conflitantes de ai_conversations
DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can create own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON ai_conversations;

-- Criar políticas para ai_conversations
-- Usuários podem ver suas próprias conversas
CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias conversas
CREATE POLICY "Users can create own conversations" ON ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias conversas
CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar suas próprias conversas
CREATE POLICY "Users can delete own conversations" ON ai_conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Remover políticas conflitantes de ai_messages
DROP POLICY IF EXISTS "Users can manage messages in own conversations" ON ai_messages;
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON ai_messages;
DROP POLICY IF EXISTS "Users can create messages in own conversations" ON ai_messages;
DROP POLICY IF EXISTS "Users can update messages in own conversations" ON ai_messages;
DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON ai_messages;

-- Criar políticas para ai_messages
-- Usuários podem ver mensagens de suas próprias conversas
CREATE POLICY "Users can view messages in own conversations" ON ai_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem criar mensagens em suas próprias conversas
CREATE POLICY "Users can create messages in own conversations" ON ai_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem atualizar mensagens de suas próprias conversas
CREATE POLICY "Users can update messages in own conversations" ON ai_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- Usuários podem deletar mensagens de suas próprias conversas
CREATE POLICY "Users can delete messages in own conversations" ON ai_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
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
WHERE tablename IN ('ai_conversations', 'ai_messages')
ORDER BY tablename, policyname;

