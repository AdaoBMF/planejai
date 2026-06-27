import type { ChatHistoryRecord, ChatItem } from '@/data/chatHistory'
import type { InsightData } from '@/services/ai.service'

export const createChatContext = (
  id: string,
  prompt: string,
  data: InsightData
) => {
  const chatContext: ChatHistoryRecord = {
    id,
    inicialPrompt: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
      {
        role: 'model',
        parts: [{ text: JSON.stringify(data) }],
      },
    ],
    chat: [],
  }

  return chatContext
}

export const addInicialChatHistory = (inicialPrompt: ChatItem[]) => {
  return [...inicialPrompt]
}
