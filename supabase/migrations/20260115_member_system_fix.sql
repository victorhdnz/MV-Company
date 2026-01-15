-- =====================================================
-- SISTEMA DE MEMBROS - GOGH LAB (CORREÇÃO)
-- Migração com tratamento para tabelas existentes
-- =====================================================

-- 1. SUBSCRIPTIONS - Assinaturas do Stripe
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('gogh_essencial', 'gogh_pro')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- RLS para subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop policies se existirem e recriar
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');


-- 2. PLAN_FEATURES - Recursos disponíveis por plano
-- =====================================================
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id TEXT NOT NULL CHECK (plan_id IN ('gogh_essencial', 'gogh_pro')),
  feature_key TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  monthly_limit INTEGER,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, feature_key)
);

-- Inserir recursos padrão (ignorar se já existem)
INSERT INTO plan_features (plan_id, feature_key, feature_name, feature_description, monthly_limit, is_enabled) VALUES
('gogh_essencial', 'ai_messages', 'Mensagens de IA', 'Quantidade de mensagens com agentes de IA', 500, true),
('gogh_essencial', 'ai_agents', 'Agentes de IA', 'Acesso aos agentes de IA', NULL, true),
('gogh_essencial', 'courses', 'Cursos', 'Acesso aos cursos de edição', NULL, true),
('gogh_essencial', 'canva_access', 'Acesso Canva Pro', 'Acesso à conta Canva Pro compartilhada', NULL, true),
('gogh_essencial', 'capcut_access', 'Acesso CapCut Pro', 'Acesso à conta CapCut Pro compartilhada', NULL, true),
('gogh_essencial', 'support_priority', 'Suporte Prioritário', 'Atendimento prioritário', NULL, false),
('gogh_essencial', 'custom_agents', 'Agentes Personalizados', 'Criar agentes de IA personalizados', NULL, false),
('gogh_pro', 'ai_messages', 'Mensagens de IA', 'Quantidade de mensagens com agentes de IA', 2000, true),
('gogh_pro', 'ai_agents', 'Agentes de IA', 'Acesso aos agentes de IA', NULL, true),
('gogh_pro', 'courses', 'Cursos', 'Acesso aos cursos de edição', NULL, true),
('gogh_pro', 'canva_access', 'Acesso Canva Pro', 'Acesso à conta Canva Pro compartilhada', NULL, true),
('gogh_pro', 'capcut_access', 'Acesso CapCut Pro', 'Acesso à conta CapCut Pro compartilhada', NULL, true),
('gogh_pro', 'support_priority', 'Suporte Prioritário', 'Atendimento prioritário', NULL, true),
('gogh_pro', 'custom_agents', 'Agentes Personalizados', 'Criar agentes de IA personalizados', 3, true)
ON CONFLICT (plan_id, feature_key) DO NOTHING;


-- 3. USER_USAGE - Uso mensal do usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_key, period_start)
);

CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_period ON user_usage(period_start, period_end);

ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage" ON user_usage;
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);


-- 4. AI_AGENTS - Agentes de IA disponíveis
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4o-mini',
  is_active BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir agentes padrão
INSERT INTO ai_agents (slug, name, description, avatar_url, system_prompt, is_premium, order_position) VALUES
('conteudo', 'Assistente de Conteúdo', 'Especialista em criação de conteúdo para redes sociais, posts, legendas e roteiros.', '/agents/conteudo.png', 
'Você é um especialista em criação de conteúdo para redes sociais. Ajude o usuário a criar posts engajadores, legendas criativas, roteiros para vídeos e estratégias de conteúdo. Seja criativo, use emojis quando apropriado e sempre considere o público-alvo. Responda em português brasileiro.', false, 1),
('marketing', 'Estrategista de Marketing', 'Expert em estratégias de marketing digital, campanhas e análise de métricas.', '/agents/marketing.png',
'Você é um estrategista de marketing digital experiente. Ajude o usuário com estratégias de marketing, análise de campanhas, definição de público-alvo, funis de venda e métricas. Seja prático e dê exemplos concretos. Responda em português brasileiro.', false, 2),
('copy', 'Copywriter', 'Mestre em textos persuasivos, headlines e copy para vendas.', '/agents/copy.png',
'Você é um copywriter especializado em textos persuasivos. Ajude o usuário a criar headlines impactantes, textos de venda, CTAs efetivos e copy para anúncios. Use técnicas de copywriting como AIDA, PAS e storytelling. Responda em português brasileiro.', false, 3),
('design', 'Consultor de Design', 'Especialista em design visual, composição e identidade de marca.', '/agents/design.png',
'Você é um consultor de design especializado em criação visual para redes sociais. Ajude o usuário com ideias de design, composição, cores, tipografia e identidade visual. Dê sugestões práticas que possam ser implementadas no Canva ou CapCut. Responda em português brasileiro.', false, 4),
('nicho', 'Especialista de Nicho', 'Ajuda a definir e dominar seu nicho de mercado.', '/agents/nicho.png',
'Você é um especialista em definição e análise de nichos de mercado. Ajude o usuário a identificar seu nicho ideal, entender seu público, analisar concorrência e encontrar oportunidades de diferenciação. Seja analítico e estratégico. Responda em português brasileiro.', true, 5),
('automacao', 'Expert em Automação', 'Especialista em automação de processos e ferramentas.', '/agents/automacao.png',
'Você é um expert em automação e produtividade. Ajude o usuário a automatizar processos, criar fluxos de trabalho eficientes e usar ferramentas de automação. Foque em soluções práticas e fáceis de implementar. Responda em português brasileiro.', true, 6)
ON CONFLICT (slug) DO NOTHING;


-- 5. AI_CONVERSATIONS - Conversas com IA
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nova conversa',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent_id ON ai_conversations(agent_id);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_conversations;
CREATE POLICY "Users can manage own conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = user_id);


-- 6. AI_MESSAGES - Mensagens das conversas
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage messages in own conversations" ON ai_messages;
CREATE POLICY "Users can manage messages in own conversations" ON ai_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );


-- 7. SUPPORT_TICKETS - Tickets de suporte
-- =====================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('canva_access', 'capcut_access', 'general', 'bug_report', 'feature_request')),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(ticket_type);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 8. SUPPORT_MESSAGES - Mensagens dos tickets
-- =====================================================
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);

ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own tickets" ON support_messages;
CREATE POLICY "Users can view messages in own tickets" ON support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
    AND is_internal = FALSE
  );

DROP POLICY IF EXISTS "Users can send messages to own tickets" ON support_messages;
CREATE POLICY "Users can send messages to own tickets" ON support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
    AND auth.uid() = sender_id
    AND is_internal = FALSE
  );


-- 9. COURSES - A tabela já existe, apenas adicionar colunas que faltam
-- =====================================================
-- Adicionar colunas que podem estar faltando na tabela courses existente
DO $$
BEGIN
  -- Adicionar colunas novas que não existem na versão antiga
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_avatar TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(4,1) DEFAULT 0;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS lessons_count INTEGER DEFAULT 0;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS plan_required TEXT DEFAULT 'all';
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS order_position INTEGER DEFAULT 0;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
END$$;

-- Inserir cursos padrão (incluindo course_type que é obrigatório na tabela existente)
INSERT INTO courses (slug, title, description, course_type, instructor_name, is_premium_only, is_active, order_index) VALUES
('canva-basico', 'Canva do Zero ao Avançado', 'Aprenda a criar designs profissionais no Canva, desde o básico até técnicas avançadas.', 'canva', 'Gogh Lab', false, true, 1),
('capcut-edicao', 'Edição de Vídeo com CapCut', 'Domine a edição de vídeos para redes sociais usando o CapCut Pro.', 'capcut', 'Gogh Lab', false, true, 2),
('reels-virais', 'Criação de Reels Virais', 'Aprenda técnicas e tendências para criar Reels que viralizam.', 'strategy', 'Gogh Lab', true, true, 3),
('ia-conteudo', 'IA para Criadores de Conteúdo', 'Use inteligência artificial para turbinar sua produção de conteúdo.', 'strategy', 'Gogh Lab', true, true, 4)
ON CONFLICT (slug) DO NOTHING;


-- 10. COURSE_MODULES
-- =====================================================
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);


-- 11. COURSE_LESSONS
-- =====================================================
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);


-- 12. USER_COURSE_PROGRESS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);

ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own progress" ON user_course_progress;
CREATE POLICY "Users can manage own progress" ON user_course_progress
  FOR ALL USING (auth.uid() = user_id);


-- 13. USER_NICHE_PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_niche_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  niche TEXT,
  target_audience TEXT,
  brand_voice TEXT,
  content_pillars JSONB DEFAULT '[]'::jsonb,
  competitors JSONB DEFAULT '[]'::jsonb,
  goals TEXT,
  platforms JSONB DEFAULT '[]'::jsonb,
  additional_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_niche_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own niche profile" ON user_niche_profiles;
CREATE POLICY "Users can manage own niche profile" ON user_niche_profiles
  FOR ALL USING (auth.uid() = user_id);


-- 14. TOOL_ACCESS_CREDENTIALS
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_access_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('canva', 'capcut')),
  email TEXT NOT NULL,
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_type)
);

ALTER TABLE tool_access_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credentials" ON tool_access_credentials;
CREATE POLICY "Users can view own credentials" ON tool_access_credentials
  FOR SELECT USING (auth.uid() = user_id);


-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para obter assinatura ativa do usuário
CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_id TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.plan_id,
    s.status,
    s.current_period_end
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status = 'active'
    AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Função para verificar acesso a recurso
CREATE OR REPLACE FUNCTION check_user_feature_access(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_id TEXT;
  v_is_enabled BOOLEAN;
BEGIN
  SELECT plan_id INTO v_plan_id
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
    AND current_period_end > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_plan_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT is_enabled INTO v_is_enabled
  FROM plan_features
  WHERE plan_id = v_plan_id AND feature_key = p_feature_key;
  
  RETURN COALESCE(v_is_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Função para incrementar uso
CREATE OR REPLACE FUNCTION increment_feature_usage(p_user_id UUID, p_feature_key TEXT, p_amount INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
  v_current_usage INTEGER;
  v_limit INTEGER;
  v_plan_id TEXT;
BEGIN
  v_period_start := date_trunc('month', NOW())::DATE;
  v_period_end := (date_trunc('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  SELECT plan_id INTO v_plan_id
  FROM subscriptions
  WHERE user_id = p_user_id AND status = 'active' AND current_period_end > NOW()
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_plan_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT monthly_limit INTO v_limit
  FROM plan_features
  WHERE plan_id = v_plan_id AND feature_key = p_feature_key;
  
  IF v_limit IS NULL THEN
    INSERT INTO user_usage (user_id, feature_key, usage_count, period_start, period_end)
    VALUES (p_user_id, p_feature_key, p_amount, v_period_start, v_period_end)
    ON CONFLICT (user_id, feature_key, period_start) 
    DO UPDATE SET usage_count = user_usage.usage_count + p_amount, updated_at = NOW();
    RETURN TRUE;
  END IF;
  
  SELECT COALESCE(usage_count, 0) INTO v_current_usage
  FROM user_usage
  WHERE user_id = p_user_id 
    AND feature_key = p_feature_key 
    AND period_start = v_period_start;
  
  IF COALESCE(v_current_usage, 0) + p_amount > v_limit THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO user_usage (user_id, feature_key, usage_count, period_start, period_end)
  VALUES (p_user_id, p_feature_key, p_amount, v_period_start, v_period_end)
  ON CONFLICT (user_id, feature_key, period_start) 
  DO UPDATE SET usage_count = user_usage.usage_count + p_amount, updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Função para obter uso atual
CREATE OR REPLACE FUNCTION get_user_usage(p_user_id UUID, p_feature_key TEXT)
RETURNS TABLE (
  current_usage INTEGER,
  monthly_limit INTEGER,
  percentage_used DECIMAL
) AS $$
DECLARE
  v_period_start DATE;
  v_plan_id TEXT;
BEGIN
  v_period_start := date_trunc('month', NOW())::DATE;
  
  SELECT s.plan_id INTO v_plan_id
  FROM subscriptions s
  WHERE s.user_id = p_user_id AND s.status = 'active' AND s.current_period_end > NOW()
  ORDER BY s.created_at DESC LIMIT 1;
  
  RETURN QUERY
  SELECT 
    COALESCE(u.usage_count, 0)::INTEGER as current_usage,
    pf.monthly_limit::INTEGER as monthly_limit,
    CASE 
      WHEN pf.monthly_limit IS NULL THEN 0
      WHEN pf.monthly_limit = 0 THEN 100
      ELSE ROUND((COALESCE(u.usage_count, 0)::DECIMAL / pf.monthly_limit::DECIMAL) * 100, 2)
    END as percentage_used
  FROM plan_features pf
  LEFT JOIN user_usage u ON u.user_id = p_user_id 
    AND u.feature_key = p_feature_key 
    AND u.period_start = v_period_start
  WHERE pf.plan_id = v_plan_id AND pf.feature_key = p_feature_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- TRIGGER para updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers (ignorar se já existem)
DO $$
BEGIN
  -- subscriptions
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
    CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- ai_conversations
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_conversations_updated_at') THEN
    CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- support_tickets
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_tickets_updated_at') THEN
    CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- user_niche_profiles
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_niche_profiles_updated_at') THEN
    CREATE TRIGGER update_user_niche_profiles_updated_at BEFORE UPDATE ON user_niche_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- tool_access_credentials
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tool_access_credentials_updated_at') THEN
    CREATE TRIGGER update_tool_access_credentials_updated_at BEFORE UPDATE ON tool_access_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Migração do sistema de membros executada com sucesso!';
END$$;

