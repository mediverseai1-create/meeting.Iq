import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Add it to your .env.local file.')
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export async function enhanceNotes(params: {
  rawNotes: string
  transcript?: string
  meetingType?: string
  context?: string
}): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `You are an expert meeting note-taker. Enhance and organize these raw meeting notes while preserving the original intent.

Meeting Type: ${params.meetingType || 'General'}
${params.context ? `Context: ${params.context}` : ''}
${params.transcript ? `Transcript excerpt: ${params.transcript.slice(0, 3000)}` : ''}

Raw Notes:
${params.rawNotes}

Instructions:
- Clean up grammar and spelling
- Organize into clear sections with headings
- Preserve all original points — do not remove information
- Do not add information that wasn't in the notes or transcript
- Format with markdown (## headings, bullet points)
- Keep it concise and professional

Enhanced Notes:`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateSummary(params: {
  notes: string
  transcript?: string
  meetingTitle: string
  meetingType?: string
  participants?: string[]
}): Promise<{
  executive_summary: string
  key_points: string[]
  decisions: string[]
  open_questions: string[]
  important_quotes: string[]
  topics: string[]
}> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const content = [
    params.notes,
    params.transcript ? `\n\nTranscript:\n${params.transcript.slice(0, 5000)}` : '',
  ].join('')

  const prompt = `Analyze this meeting and produce a structured JSON summary.

Meeting: ${params.meetingTitle}
Type: ${params.meetingType || 'General'}
${params.participants?.length ? `Participants: ${params.participants.join(', ')}` : ''}

Content:
${content}

Return ONLY valid JSON with this structure:
{
  "executive_summary": "2-3 sentence summary",
  "key_points": ["point 1", "point 2", ...],
  "decisions": ["decision 1", ...],
  "open_questions": ["question 1", ...],
  "important_quotes": ["quote 1", ...],
  "topics": ["topic 1", ...]
}

Rules:
- Only include information present in the content
- If a field has no data, use an empty array or empty string
- Decisions must be actual decisions made, not discussions
- Keep key_points to the 5 most important points`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback
  }

  return {
    executive_summary: text.slice(0, 500),
    key_points: [],
    decisions: [],
    open_questions: [],
    important_quotes: [],
    topics: [],
  }
}

export async function extractActionItems(params: {
  notes: string
  transcript?: string
}): Promise<Array<{ title: string; assignee?: string; due_date?: string; priority: string }>> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `Extract action items from this meeting content.

Content:
${params.notes}
${params.transcript ? `\nTranscript:\n${params.transcript.slice(0, 4000)}` : ''}

Return ONLY valid JSON array:
[
  {
    "title": "Action item description",
    "assignee": "Person name or null",
    "due_date": "YYYY-MM-DD or null",
    "priority": "low|medium|high"
  }
]

Rules:
- Only extract explicit action items and commitments
- Do not invent items not mentioned in the content
- Return empty array [] if no action items found`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback
  }
  return []
}

export async function askAboutMeeting(params: {
  question: string
  notes: string
  transcript?: string
  insights?: string
  meetingTitle: string
}): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `You are answering questions about a specific meeting based only on the available meeting data.

Meeting: ${params.meetingTitle}

Available data:
Notes: ${params.notes}
${params.transcript ? `Transcript: ${params.transcript.slice(0, 4000)}` : ''}
${params.insights ? `Summary: ${params.insights}` : ''}

Question: ${params.question}

Instructions:
- Answer based ONLY on the available meeting data
- If the answer is not in the data, say "I couldn't find information about that in this meeting's notes or transcript."
- Be concise and direct
- Quote relevant parts when helpful

Answer:`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateFollowUp(params: {
  notes: string
  decisions: string[]
  actionItems: Array<{ title: string; assignee?: string }>
  meetingTitle: string
  participants?: string[]
}): Promise<{ email: string; recap: string }> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `Generate a professional follow-up email and meeting recap based on this meeting data.

Meeting: ${params.meetingTitle}
${params.participants?.length ? `Participants: ${params.participants.join(', ')}` : ''}

Notes Summary:
${params.notes.slice(0, 2000)}

Decisions Made:
${params.decisions.map((d) => `- ${d}`).join('\n')}

Action Items:
${params.actionItems.map((a) => `- ${a.title}${a.assignee ? ` (${a.assignee})` : ''}`).join('\n')}

Return ONLY valid JSON:
{
  "email": "Full follow-up email text",
  "recap": "Short meeting recap paragraph"
}

Rules:
- Only include information from the provided data
- Professional but friendly tone
- Email should include: greeting, brief summary, decisions, action items, next steps`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback
  }

  return {
    email: text,
    recap: '',
  }
}

export async function crossMeetingQuery(params: {
  question: string
  meetingsData: string
}): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `You are analyzing a user's meeting history to answer their question.

Meeting History:
${params.meetingsData.slice(0, 8000)}

Question: ${params.question}

Instructions:
- Answer based ONLY on the provided meeting history
- Reference specific meetings when relevant
- If the answer is not in the history, say so clearly
- Be specific and cite which meetings contain relevant information

Answer:`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
