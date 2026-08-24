'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import type { MeetingFolder, MeetingTemplate } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  meeting_type: z.string().min(1),
  template_id: z.string().optional(),
  folder_id: z.string().optional(),
  participants: z.string().optional(),
  context: z.string().optional(),
  scheduled_at: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

const MEETING_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'sales', label: 'Sales Call' },
  { value: 'team', label: 'Team Meeting' },
  { value: 'one_on_one', label: '1:1' },
  { value: 'client', label: 'Client Meeting' },
  { value: 'interview', label: 'Interview' },
  { value: 'product', label: 'Product Meeting' },
  { value: 'investor', label: 'Investor Meeting' },
]

export function NewMeetingForm({ templates, folders }: { templates: MeetingTemplate[]; folders: MeetingFolder[] }) {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const templateOptions = [
    { value: '', label: 'No template' },
    ...templates.map((t) => ({ value: t.id, label: t.name })),
  ]

  const folderOptions = [
    { value: '', label: 'No folder' },
    ...folders.map((f) => ({ value: f.id, label: f.name })),
  ]

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { meeting_type: 'general' },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const participants = values.participants
      ? values.participants.split(',').map((p) => p.trim()).filter(Boolean)
      : []

    const { data: meeting, error: createError } = await supabase
      .from('meetings')
      .insert({
        user_id: user.id,
        title: values.title,
        meeting_type: values.meeting_type,
        template_id: values.template_id || null,
        folder_id: values.folder_id || null,
        participants,
        context: values.context || null,
        scheduled_at: values.scheduled_at || null,
        status: 'draft',
      })
      .select()
      .single()

    if (createError) {
      setError(createError.message)
    } else if (meeting) {
      // Create empty notes record
      await supabase.from('meeting_notes').insert({
        meeting_id: meeting.id,
        user_id: user.id,
        raw_notes: '',
      })
      router.push(`/meetings/${meeting.id}`)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Meeting title *"
          placeholder="e.g. Q3 Sales Review with Acme Corp"
          error={errors.title?.message}
          {...register('title')}
        />

        <Select
          label="Meeting type"
          options={MEETING_TYPES}
          {...register('meeting_type')}
        />

        {templates.length > 0 && (
          <Select
            label="Template (optional)"
            options={templateOptions}
            {...register('template_id')}
          />
        )}

        {folders.length > 0 && (
          <Select
            label="Folder (optional)"
            options={folderOptions}
            {...register('folder_id')}
          />
        )}

        <Input
          label="Participants (optional)"
          placeholder="Sarah Chen, Mike Torres (comma-separated)"
          {...register('participants')}
        />

        <Input
          label="Scheduled date & time (optional)"
          type="datetime-local"
          {...register('scheduled_at')}
        />

        <Textarea
          label="Context / agenda (optional)"
          placeholder="What is this meeting about? What do you want to accomplish?"
          rows={4}
          {...register('context')}
        />

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            Create Meeting
          </Button>
        </div>
      </form>
    </div>
  )
}
