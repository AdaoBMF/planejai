import type { ChatHistoryRecord, ChatItem } from '@/data/chatHistory'

const LOCAL_STORAGE_KEY = 'chat-data'

const getStorage = () => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  const storageArray: ChatHistoryRecord[] = storage ? JSON.parse(storage) : []

  return storageArray
}
const saveStorage = (storage: ChatHistoryRecord[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage))
}

export const useChatStorage = () => {
  const createChatHistory = (chatContext: ChatHistoryRecord) => {
    const storage = getStorage()
    const updatedStorage = [...storage, chatContext]

    saveStorage(updatedStorage)
  }

  const getChatHistory = (id: string) => {
    const storage = getStorage()

    if (!storage.length) return

    const historyRec = storage.find((h) => h.id === id)

    return historyRec
  }

  const updateChatHistory = (id: string, chatItem: ChatItem) => {
    const storage = getStorage()
    const historyRecord = storage.find((h) => h.id === id)

    if (!historyRecord) return

    historyRecord.chat = [...historyRecord.chat, chatItem]

    const updatedStorage = [
      ...storage.filter((h) => h.id !== id),
      historyRecord,
    ]

    saveStorage(updatedStorage)

    return historyRecord
  }

  return { createChatHistory, getChatHistory, updateChatHistory }
}
