import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  enhanceNotes,
  generateSummary,
  extractActionItems,
  askAboutMeeting,
  generateFollowUp,
  crossMeetingQuery,
} from '@/lib/gemini/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY is not configured. Add it to your .env.local file.',
      }, { status: 503 })
    }

    const body = await request.json()
    const { type } = body

    let result: unknown

    switch (type) {
      case 'enhance_notes':
        result = await enhanceNotes({
          rawNotes: body.notes || '',
          transcript: body.transcript || '',
          meetingType: body.meetingType || 'general',
          context: body.context || '',
        })
        break

      case 'generate_summary':
        result = await generateSummary({
          notes: body.notes || '',
          transcript: body.transcript || '',
          meetingTitle: body.meetingTitle || 'Meeting',
          meetingType: body.meetingType || 'general',
          participants: body.participants || [],
        })
        break

      case 'extract_actions':
        result = await extractActionItems({
          notes: body.notes || '',
          transcript: body.transcript || '',
        })
        break

      case 'ask_question':
        result = await askAboutMeeting({
          question: body.question || '',
          notes: body.notes || '',
          transcript: body.transcript || '',
          insights: body.insights || '',
          meetingTitle: body.meetingTitle || 'Meeting',
        })
        break

      case 'generate_followup':
        result = await generateFollowUp({
          notes: body.notes || '',
          decisions: body.decisions || [],
          actionItems: body.actionItems || [],
          meetingTitle: body.meetingTitle || 'Meeting',
          participants: body.participants || [],
        })
        break

      case 'cross_meeting_query': {
        // Fetch user's meetings with notes for context
        const { data: meetings } = await supabase
          .from('meetings')
          .select(`
            id, title, meeting_type, created_at,
            meeting_notes(raw_notes, enhanced_notes),
            meeting_insights(executive_summary, key_points, decisions)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        const meetingsText = meetings?.map((m) => {
          const notes = Array.isArray(m.meeting_notes) ? m.meeting_notes[0] : null
          const ins = Array.isArray(m.meeting_insights) ? m.meeting_insights[0] : null
          return [
            `## ${m.title} (${new Date(m.created_at).toLocaleDateString()})`,
            notes?.enhanced_notes || notes?.raw_notes || '',
            ins?.executive_summary ? `Summary: ${ins.executive_summary}` : '',
          ].filter(Boolean).join('\n')
        }).join('\n\n---\n\n') || ''

        result = await crossMeetingQuery({
          question: body.question || '',
          meetingsData: meetingsText,
        })
        break
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown type: ${type}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    console.error('[Gemini API Error]', err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
