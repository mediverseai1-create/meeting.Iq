import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// Transcription provider integration point.
// Supported providers: AssemblyAI, Deepgram, OpenAI Whisper
// Add TRANSCRIPTION_PROVIDER=assemblyai and ASSEMBLYAI_API_KEY=... to .env.local

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

    // Verify ownership via RLS client
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id')
      .eq('id', meetingId)
      .eq('user_id', user.id)
      .single()

    if (!meeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 })
    }

    // Use admin client for storage upload (bypasses RLS for service operations)
    const admin = createAdminClient()

    // Ensure bucket exists
    const { data: buckets } = await admin.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === 'audio-recordings')
    if (!bucketExists) {
      await admin.storage.createBucket('audio-recordings', {
        public: false,
        fileSizeLimit: 104857600, // 100MB
      })
    }

    // Upload audio to storage
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileName = `${user.id}/${meetingId}/${Date.now()}.webm`

    const { error: uploadError } = await admin.storage
      .from('audio-recordings')
      .upload(fileName, buffer, { contentType: audioFile.type || 'audio/webm', upsert: true })

    if (uploadError) {
      console.error('[Transcribe] Storage upload error:', uploadError)
    }

    // -------------------------------------------------------
    // PRODUCTION: Wire your transcription provider here
    // -------------------------------------------------------
    // AssemblyAI example:
    //   const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    //     method: 'POST',
    //     headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    //     body: buffer,
    //   })
    //   const { upload_url } = await uploadRes.json()
    //   const txRes = await fetch('https://api.assemblyai.com/v2/transcript', {
    //     method: 'POST',
    //     headers: { authorization: process.env.ASSEMBLYAI_API_KEY!, 'content-type': 'application/json' },
    //     body: JSON.stringify({ audio_url: upload_url }),
    //   })
    //   const { id: txId } = await txRes.json()
    //   // Poll for completion, then update transcript record with raw_transcript and status: 'completed'

    // Mark as failed until a provider is configured
    if (transcriptId) {
      await admin
        .from('transcripts')
        .update({
          status: 'failed',
          error_message: 'Transcription provider not configured. Audio was saved. Paste a transcript manually, or add an ASSEMBLYAI_API_KEY / DEEPGRAM_API_KEY to .env.local.',
        })
        .eq('id', transcriptId)
    }

    return NextResponse.json({
      success: false,
      error: 'Configuration required: audio was saved to storage. Add a transcription provider (AssemblyAI, Deepgram) to activate auto-transcription. You can paste a transcript manually in the Transcript tab.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transcription failed'
    console.error('[Transcribe API Error]', err)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
