import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Note: This endpoint processes audio for transcription.
// For production transcription, integrate a service like:
// - AssemblyAI (assemblyai.com)
// - Deepgram (deepgram.com)
// - OpenAI Whisper API
// Configure TRANSCRIPTION_API_KEY and TRANSCRIPTION_PROVIDER in .env.local

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const meetingId = formData.get('meetingId') as string
    const transcriptId = formData.get('transcriptId') as string

    if (!audioFile || !meetingId) {
      return NextResponse.json({ success: false, error: 'Missing audio or meetingId' }, { status: 400 })
    }

    // Verify ownership
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (!meeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 })
    }

    // -------------------------------------------------------
    // PRODUCTION: Integrate your transcription provider here
    // -------------------------------------------------------
    // Example with AssemblyAI:
    //   const buffer = Buffer.from(await audioFile.arrayBuffer())
    //   const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    //     method: 'POST',
    //     headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    //     body: buffer,
    //   })
    //   const { upload_url } = await uploadRes.json()
    //   const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
    //     method: 'POST',
    //     headers: { authorization: ..., 'content-type': 'application/json' },
    //     body: JSON.stringify({ audio_url: upload_url }),
    //   })
    //   ... poll for result ...

    // For now: mark as failed with configuration required message
    await supabase
      .from('transcripts')
      .update({
        status: 'failed',
        error_message: 'Transcription service not configured. Add a transcription provider (AssemblyAI, Deepgram, or Whisper) to .env.local and implement the transcription logic in /api/transcribe/route.ts',
      })
      .eq('id', transcriptId)

    return NextResponse.json({
      success: false,
      error: 'Configuration required: Add a transcription provider to enable audio transcription. You can paste a transcript manually in the Transcript tab.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transcription failed'
    console.error('[Transcribe API Error]', err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
