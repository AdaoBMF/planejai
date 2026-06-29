import 'react-loading-skeleton/dist/skeleton.css'

import { MessageCircle, Send } from 'lucide-react'
import { type SyntheticEvent, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { ChatError } from '@/context/theme/ChatError'
import type { ChatHistoryRecord, ChatItem } from '@/data/chatHistory'
import { useChatStorage } from '@/hooks/useChatStorage'
import { useInsight } from '@/hooks/useInsight'
import { sendChat } from '@/services/ai.service'

import { Content } from '../insights/Content'
import { Error } from '../insights/Error'

interface AIInsightCardProps {
  simulationId: string
}

interface ChatItemProps {
  role: string
  text: string
}

const styles = {
  model: 'text-sm ml-1',
  user: 'text-muted-foreground text-sm ml-1',
}

function ChatItem({ role, text }: ChatItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <span>
          <MessageCircle className="text-primary" />
        </span>
        <span className="text-muted-foreground font-semibold">
          {role === 'user' ? 'Você' : 'Resposta da IA'}
        </span>
      </div>
      <span className={styles[role]}>{text}</span>
      <Divider orientation="horizontal" spacing={10} />
    </div>
  )
}

function LoadingChat() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <span>
          <MessageCircle className="text-primary" />
        </span>
        <span className="text-muted-foreground font-semibold">
          'Resposta da IA'
        </span>
      </div>
      <div className="ml-2 flex flex-row gap-2">
        <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:.7s]"></div>
        <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:.3s]"></div>
        <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:.7s]"></div>
      </div>
      <Divider orientation="horizontal" spacing={10} />
    </div>
  )
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { getChatHistory, updateChatHistory, removeQuestion } = useChatStorage()
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isWaitingModel, setIsWaitingModel] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [chatError, setChatError] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryRecord>(
    (): ChatHistoryRecord => {
      const chatHistory = getChatHistory(simulationId)

      if (!chatHistory) return

      return chatHistory
    }
  )
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (!inputValue || isWaitingModel) return

    e.preventDefault()
    await onSendChat(simulationId, inputValue)
    inputRef.current?.focus()
  }

  const onSendChat = async (simulationId: string, prompt: string) => {
    if (!chatHistory.inicialPrompt.length) return
    setInputValue('')
    const chat: ChatItem[] = [...chatHistory.inicialPrompt, ...chatHistory.chat]

    const newChatItem: ChatItem = {
      role: 'user',
      parts: [{ text: prompt }],
    }

    chat.push(newChatItem)
    const chatHistoryWitQuestion = updateChatHistory(simulationId, newChatItem)

    setChatHistory(chatHistoryWitQuestion)
    setIsLoadingChat(true)
    setIsWaitingModel(true)
    try {
      const agentResponse = await sendChat(chat)
      const chatHistoryWithAnswer = updateChatHistory(
        simulationId,
        agentResponse
      )
      setChatHistory(chatHistoryWithAnswer)
    } catch (e) {
      console.log(e)
      setChatError(true)
    }

    setIsLoadingChat(false)
    setIsWaitingModel(false)
  }

  const onCloseModal = async (retry: boolean) => {
    setChatError(false)

    if (retry) {
      setIsLoadingChat(true)
      setIsWaitingModel(true)
      const chat = [...chatHistory.inicialPrompt, ...chatHistory.chat]
      try {
        const agentResponse = await sendChat(chat)
        const chatHistoryWithAnswer = updateChatHistory(
          simulationId,
          agentResponse
        )
        setChatHistory(chatHistoryWithAnswer)
      } catch (e) {
        console.log(e)
        setChatError(true)
      }

      setIsLoadingChat(false)
      setIsWaitingModel(false)
      return
    }

    const updatedChat = removeQuestion(simulationId)
    setChatHistory(updatedChat)
  }

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex h-5 rounded-lg"
            containerClassName="flex-1"
            inline
            enableAnimation
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => fetchInsight(simulationId)}
        />
      )}
      {!isLoading && !error && insight && <Content insight={insight} />}
      <Divider orientation="horizontal" spacing={10} />
      <div className="scroll-smooth lg:max-h-93 lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent] lg:overflow-y-auto lg:pr-2">
        {chatHistory?.chat?.length
          ? chatHistory.chat.map((i, idx) => (
              <ChatItem role={i.role} text={i.parts[0].text} key={idx} />
            ))
          : ''}
        {isLoadingChat ? <LoadingChat /> : ''}

        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <span className="grow">
            <Input
              ref={inputRef}
              placeholder="Faça uma pergunta para o agente financeiro"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus={!isLoadingChat}
              disabled={isLoadingChat}
            />
          </span>
          <Button
            type="submit"
            icon={Send}
            variant="primary"
            className="mr-0"
            disabled={!inputValue || isLoadingChat}
          />
        </form>
        <div ref={bottomRef} />
      </div>
      <Modal
        isOpen={chatError}
        children={<ChatError onClose={(retry) => onCloseModal(retry)} />}
        onClose={(retry) => onCloseModal(retry)}
      />
    </div>
  )
}
