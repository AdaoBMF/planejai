import type { ChatItem } from '@/data/chatHistory'

const GEMINI_API_KEY = String(import.meta.env.VITE_AI_APP_KEY)
const GEMINI_API_URL = String(import.meta.env.VITE_AI_APP_URL)
const GEMINI_API_MODEL = String(import.meta.env.VITE_AI_APP_MODEL)
const MAX_RETRIES = Number(import.meta.env.MAX_MODEL_API_RETRIES) || 3

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
      role: string
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivational: {
    content: string
  }
}
const sanitizeJsonResponse = (json: string) => {
  return json.replace('```json', '').replace('```', '')
}

const url = `${GEMINI_API_URL}/${GEMINI_API_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const fetchWithRetry = async (body: string, attempt = 0, delay = 2000) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (res.status === 503) {
      console.warn(`Gemini 503 detectado`)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(body, attempt + 1, delay * 2)
      }
      throw new Error('Agent is unavailable')
    }
    return res
  } catch (e) {
    console.log(e)
    throw e
  }
}

const callGeminiApi = async (prompt: string) => {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
  })

  const response = await fetchWithRetry(body)

  if (!response.ok) {
    throw new Error(`Call Gemini gone wrong! Error: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiApi(prompt)

  const json = sanitizeJsonResponse(
    response.candidates[0].content.parts[0].text
  )

  return JSON.parse(json) as InsightData
}

export const sendChat = async (context: ChatItem[]) => {
  const body = JSON.stringify({
    contents: context,
  })

  const response = await fetchWithRetry(body)

  if (!response.ok) {
    throw new Error(
      `Sending chat question gone wrong! Error: ${response.status}`
    )
  }

  const { candidates } = (await response.json()) as GeminiResponse
  const [{ content }] = candidates
  return content as ChatItem
}
