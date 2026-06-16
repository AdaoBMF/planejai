const GEMINI_API_KEY = String(import.meta.env.VITE_AI_APP_KEY)
const GEMINI_API_URL = String(import.meta.env.VITE_AI_APP_URL)
const GEMINI_API_MODEL = String(import.meta.env.VITE_AI_APP_MODEL)

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
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

const url = `/api/models/${GEMINI_API_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const callGeminiApi = async (prompt: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Call Gemini gone wrong! Error: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiApi(prompt)

  console.log('Gemini response ==================')
  console.log(response)

  const json = response.candidates[0].content.parts[0].text

  return JSON.parse(json) as InsightData
}
