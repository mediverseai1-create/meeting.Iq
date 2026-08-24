'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Mic, Square, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { Meeting, Transcript } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  meeting: Meeting
  transcript: Transcript | null
  onTranscriptUpdate: (t: Transcript) => void
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'stopping' | 'uploading' | 'processing'

export function RecordingCapture({ meeting, transcript, onTranscriptUpdate }: Props) {
  const { toast } = useToast()
  const supabase = createClient()
  const [state, setState] = React.useState<RecordingState>('idle')
  const [duration, setDuration] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const [pasteText, setPasteText] = React.useState('')
  const [savingText, setSavingText] = React.useState(false)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function startRecording() {
    setError(null)
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
        await handleAudioBlob(blob)
      }

      recorder.start(1000)
      setState('recording')
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch (err: unknown) {
      setState('idle')
      const message = err instanceof Error ? err.message : 'Microphone access denied'
      setError(`Could not access microphone: ${message}`)
    }
  }

  function stopRecording() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    setState('stopping')
    mediaRecorderRef.current?.stop()
  }

  async function handleAudioBlob(blob: Blob) {
    setState('uploading')
    try {
      // Upload to Supabase Storage
      const fileName = `${meeting.user_id}/${meeting.id}/${Date.now()}.webm`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, blob, { contentType: blob.type, upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('audio-recordings').getPublicUrl(fileName)

      setState('processing')

      // Create/update transcript record
      const transcriptData = {
        meeting_id: meeting.id,
        user_id: meeting.user_id,
        status: 'processing' as const,
        audio_url: publicUrl,
        language: 'en',
      }

      let transcriptId = transcript?.id
      if (transcriptId) {
        await supabase.from('transcripts').update(transcriptData).eq('id', transcriptId)
      } else {
        const { data: newT } = await supabase.from('transcripts').insert(transcriptData).select().single()
        transcriptId = newT?.id
      }

      // Send for transcription
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('meetingId', meeting.id)
      formData.append('transcriptId', transcriptId || '')

      const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.success) {
        const { data: updatedT } = await supabase
          .from('transcripts')
          .select('*')
          .eq('id', transcriptId)
          .single()
        if (updatedT) onTranscriptUpdate(updatedT)
        toast({ title: 'Transcription complete', variant: 'success' })
      } else {
        await supabase.from('transcripts').update({
          status: 'failed',
          error_message: data.error || 'Transcription failed',
        }).eq('id', transcriptId)
        toast({ title: 'Transcription failed', description: data.error, variant: 'error' })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
    } finally {
      setState('idle')
    }
  }

  async function saveTextTranscript() {
    if (!pasteText.trim()) return
    setSavingText(true)
    const transcriptData = {
      meeting_id: meeting.id,
      user_id: meeting.user_id,
      status: 'completed' as const,
      raw_transcript: pasteText.trim(),
      segments: [],
      language: 'en',
    }

    let result
    if (transcript?.id) {
      result = await supabase.from('transcripts').update(transcriptData).eq('id', transcript.id).select().single()
    } else {
      result = await supabase.from('transcripts').insert(transcriptData).select().single()
    }

    if (result.data) {
      onTranscriptUpdate(result.data)
      setPasteText('')
      toast({ title: 'Transcript saved', variant: 'success' })
    }
    setSavingText(false)
  }

  function formatDuration(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const statusConfig: Record<string, { label: string; variant: 'success' | 'error' | 'info' | 'warning' }> = {
    completed: { label: 'Transcription complete', variant: 'success' },
    failed: { label: 'Transcription failed', variant: 'error' },
    processing: { label: 'Processing…', variant: 'info' },
    pending: { label: 'Queued', variant: 'info' },
  }

  return (
    <div className="space-y-6">
      {/* Existing transcript */}
      {transcript && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Transcript</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', {
              'bg-green-100 text-green-700': transcript.status === 'completed',
              'bg-red-100 text-red-700': transcript.status === 'failed',
              'bg-blue-100 text-blue-700': transcript.status === 'processing',
              'bg-gray-100 text-gray-600': transcript.status === 'pending',
            })}>
              {statusConfig[transcript.status]?.label || transcript.status}
            </span>
          </div>

          {transcript.status === 'completed' && transcript.raw_transcript && (
            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {transcript.raw_transcript}
            </div>
          )}

          {transcript.status === 'failed' && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{transcript.error_message || 'Transcription failed. Please try again.'}</p>
            </div>
          )}

          {transcript.status === 'processing' && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p>Processing your recording…</p>
            </div>
          )}
        </div>
      )}

      {/* Recording UI */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Record Meeting Audio</h3>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 py-4">
          {state === 'recording' ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />
                <button
                  onClick={stopRecording}
                  className="relative h-16 w-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Square className="h-6 w-6 fill-current" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-slate-900">{formatDuration(duration)}</p>
                <p className="text-sm text-slate-500">Recording… click to stop</p>
              </div>
            </>
          ) : state === 'idle' ? (
            <>
              <button
                onClick={startRecording}
                className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Mic className="h-7 w-7" />
              </button>
              <p className="text-sm text-slate-500">Click to start recording</p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-slate-500">
                {state === 'requesting' && 'Requesting microphone access…'}
                {state === 'stopping' && 'Stopping recording…'}
                {state === 'uploading' && 'Uploading audio…'}
                {state === 'processing' && 'Transcribing…'}
              </p>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center mt-2">
          Requires microphone permission. Audio is processed securely.
        </p>
      </div>

      {/* Manual paste */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Paste Transcript Text</h3>
        <p className="text-xs text-slate-500 mb-3">
          If you have a transcript from an external tool, paste it here to enable AI analysis.
        </p>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste your transcript text here…"
          rows={6}
          className="w-full rounded-lg border border-slate-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          size="sm"
          className="mt-3"
          onClick={saveTextTranscript}
          loading={savingText}
          disabled={!pasteText.trim()}
        >
          Save Transcript
        </Button>
      </div>
    </div>
  )
}
