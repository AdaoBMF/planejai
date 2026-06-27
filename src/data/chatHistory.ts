export interface ChatItem {
  role: string
  parts: { text: string }[]
}

export type ChatHistory = ChatItem[]

export type ChatHistoryRecord = {
  inicialPrompt: ChatHistory
  chat: ChatHistory
  id: string
}
