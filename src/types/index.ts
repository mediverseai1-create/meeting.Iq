export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  company: string | null
  role: string | null
  country: string | null
  use_case: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string | null
  owner_id: string | null
  created_at: string
  updated_at: string
}

export interface MeetingFolder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface MeetingTemplate {
  id: string
  user_id: string | null
  name: string
  description: string | null
  meeting_type: string
  template_structure: { sections?: string[] }
  is_system: boolean
  created_at: string
  updated_at: string
}

export type MeetingStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled'

export interface Meeting {
  id: string
  user_id: string
  folder_id: string | null
  template_id: string | null
  title: string
  meeting_type: string
  status: MeetingStatus
  scheduled_at: string | null
  started_at: string | null
  ended_at: string | null
  duration_seconds: number | null
  participants: string[]
  context: string | null
  tags: string[]
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface MeetingNotes {
  id: string
  meeting_id: string
  user_id: string
  raw_notes: string
  enhanced_notes: string | null
  is_enhanced: boolean
  enhanced_at: string | null
  created_at: string
  updated_at: string
}

export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface TranscriptSegment {
  speaker?: string
  text: string
  start?: number
  end?: number
}

export interface Transcript {
  id: string
  meeting_id: string
  user_id: string
  status: TranscriptStatus
  raw_transcript: string | null
  segments: TranscriptSegment[]
  language: string
  audio_url: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface MeetingInsights {
  id: string
  meeting_id: string
  user_id: string
  executive_summary: string | null
  key_points: string[]
  decisions: string[]
  open_questions: string[]
  important_quotes: string[]
  sentiment: string | null
  topics: string[]
  generated_at: string
  created_at: string
  updated_at: string
}

export type ActionItemStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ActionItemPriority = 'low' | 'medium' | 'high'

export interface ActionItem {
  id: string
  meeting_id: string | null
  user_id: string
  title: string
  description: string | null
  assignee: string | null
  due_date: string | null
  status: ActionItemStatus
  priority: ActionItemPriority
  created_at: string
  updated_at: string
}

export type SubscriptionPlan = 'free' | 'starter' | 'pro'

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  external_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface UsageRecord {
  id: string
  user_id: string
  period_start: string
  period_end: string
  meetings_count: number
  transcription_minutes: number
  ai_requests_count: number
  storage_bytes: number
  created_at: string
  updated_at: string
}

export interface PlanLimits {
  meetings_per_month: number
  transcription_minutes: number
  ai_requests: number
  storage_gb: number
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    meetings_per_month: 5,
    transcription_minutes: 30,
    ai_requests: 10,
    storage_gb: 1,
  },
  starter: {
    meetings_per_month: 50,
    transcription_minutes: 600,
    ai_requests: 200,
    storage_gb: 10,
  },
  pro: {
    meetings_per_month: -1, // unlimited
    transcription_minutes: -1,
    ai_requests: -1,
    storage_gb: 100,
  },
}

export interface GeminiRequest {
  type: 'enhance_notes' | 'generate_summary' | 'extract_actions' | 'ask_question' | 'cross_meeting_query' | 'generate_followup'
  meetingId?: string
  notes?: string
  transcript?: string
  context?: string
  question?: string
  previousMeetings?: string
  meetingType?: string
}

export interface GeminiResponse {
  success: boolean
  data?: unknown
  error?: string
}
