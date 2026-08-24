-- MeetingIQ Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  country TEXT,
  use_case TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============================================================
-- MEETING FOLDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEETING TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL,
  template_structure JSONB DEFAULT '{}',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system templates
INSERT INTO meeting_templates (name, description, meeting_type, template_structure, is_system) VALUES
('Sales Call', 'Template for sales discovery and demo calls', 'sales', '{"sections": ["Agenda", "Customer Pain Points", "Solution Presented", "Objections", "Next Steps", "Follow-up Actions"]}', TRUE),
('Team Meeting', 'Regular team sync and status update', 'team', '{"sections": ["Agenda", "Updates", "Blockers", "Decisions", "Action Items"]}', TRUE),
('1:1 Meeting', 'One-on-one manager/direct report meeting', 'one_on_one', '{"sections": ["Check-in", "Key Updates", "Challenges", "Goals", "Career Development", "Action Items"]}', TRUE),
('Client Meeting', 'External client meeting or project review', 'client', '{"sections": ["Agenda", "Project Status", "Milestones", "Issues", "Decisions", "Next Steps"]}', TRUE),
('Interview', 'Candidate interview template', 'interview', '{"sections": ["Candidate Background", "Technical Assessment", "Behavioral Questions", "Culture Fit", "Questions from Candidate", "Evaluation"]}', TRUE),
('Product Meeting', 'Product planning and review session', 'product', '{"sections": ["Context", "User Feedback", "Feature Discussion", "Prioritization", "Dependencies", "Decisions", "Action Items"]}', TRUE),
('Investor Meeting', 'Investor update or pitch meeting', 'investor', '{"sections": ["Business Overview", "Metrics & KPIs", "Progress Since Last Meeting", "Challenges", "Use of Funds", "Next Milestones", "Q&A"]}', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- MEETINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES meeting_folders(id) ON DELETE SET NULL,
  template_id UUID REFERENCES meeting_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Meeting',
  meeting_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  participants TEXT[] DEFAULT '{}',
  context TEXT,
  tags TEXT[] DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEETING NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  raw_notes TEXT DEFAULT '',
  enhanced_notes TEXT,
  is_enhanced BOOLEAN DEFAULT FALSE,
  enhanced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRANSCRIPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  raw_transcript TEXT,
  segments JSONB DEFAULT '[]',
  language TEXT DEFAULT 'en',
  audio_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEETING INSIGHTS
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  executive_summary TEXT,
  key_points JSONB DEFAULT '[]',
  decisions JSONB DEFAULT '[]',
  open_questions JSONB DEFAULT '[]',
  important_quotes JSONB DEFAULT '[]',
  sentiment TEXT,
  topics JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTION ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  due_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SHARED NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS shared_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_public BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USAGE RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  meetings_count INTEGER DEFAULT 0,
  transcription_minutes INTEGER DEFAULT 0,
  ai_requests_count INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER meeting_notes_updated_at BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER transcripts_updated_at BEFORE UPDATE ON transcripts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER meeting_insights_updated_at BEFORE UPDATE ON meeting_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Organizations: members can read their org
CREATE POLICY "orgs_member_read" ON organizations FOR SELECT
  USING (id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));
CREATE POLICY "orgs_owner_write" ON organizations FOR ALL
  USING (owner_id = auth.uid());

-- Org members
CREATE POLICY "org_members_read" ON organization_members FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner','admin')
  ));
CREATE POLICY "org_members_manage" ON organization_members FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner','admin')
  ));

-- Meeting folders: user owns them
CREATE POLICY "folders_own" ON meeting_folders FOR ALL USING (auth.uid() = user_id);

-- Meeting templates: user owns or system
CREATE POLICY "templates_read" ON meeting_templates FOR SELECT
  USING (is_system = TRUE OR user_id = auth.uid());
CREATE POLICY "templates_own_write" ON meeting_templates FOR ALL
  USING (user_id = auth.uid());

-- Meetings: user owns them
CREATE POLICY "meetings_own" ON meetings FOR ALL USING (auth.uid() = user_id);

-- Meeting notes
CREATE POLICY "notes_own" ON meeting_notes FOR ALL USING (auth.uid() = user_id);

-- Transcripts
CREATE POLICY "transcripts_own" ON transcripts FOR ALL USING (auth.uid() = user_id);

-- Insights
CREATE POLICY "insights_own" ON meeting_insights FOR ALL USING (auth.uid() = user_id);

-- Action items
CREATE POLICY "action_items_own" ON action_items FOR ALL USING (auth.uid() = user_id);

-- Shared notes: owner can manage, public can read
CREATE POLICY "shared_notes_own" ON shared_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "shared_notes_public_read" ON shared_notes FOR SELECT USING (is_public = TRUE);

-- Subscriptions: user owns
CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Usage records
CREATE POLICY "usage_own" ON usage_records FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_meeting_id ON meeting_notes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_meeting_id ON transcripts(meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items(user_id);
CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON action_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_meetings_fts ON meetings USING GIN(to_tsvector('english', title || ' ' || COALESCE(context, '')));
CREATE INDEX IF NOT EXISTS idx_notes_fts ON meeting_notes USING GIN(to_tsvector('english', COALESCE(raw_notes, '') || ' ' || COALESCE(enhanced_notes, '')));
