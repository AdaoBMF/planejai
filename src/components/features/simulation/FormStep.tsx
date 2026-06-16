import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import { type SyntheticEvent, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Input, type InputProps } from '@/components/shared/Input'
import { formatCurrency, isCurrencyInput } from '@/utils/currency'

export interface FormStepProps {
  id: string
  icon: LucideIcon
  title: string
  question: string
  inputProps: InputProps
  submitButtonProps?: {
    label: string
    emojiIcon?: string
  }
}

interface ActionButtonsProps {
  onBack: () => void
  onNext: (value: string) => void
  hideBackButton?: boolean
}

const _formatInputEntry = (entry: string, inputProps: InputProps): string => {
  return isCurrencyInput(inputProps) ? formatCurrency(entry) : entry
}

export function FormStep({
  icon: Icon,
  question,
  title,
  inputProps,
  submitButtonProps,
  hideBackButton,
  onBack,
  onNext,
}: FormStepProps & ActionButtonsProps) {
  const [inputValue, setInputValue] = useState('')
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    if (!inputValue) return

    e.preventDefault()
    onNext(inputValue)
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
      <div className="bg-primary mb-4 flex h-15 w-15 items-center justify-center rounded-xl">
        <Icon size={32} className="text-primary-foreground" />
      </div>
      <h2 className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>
      <h3 className="text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl">
        {question}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          {...inputProps}
          value={inputValue}
          onChange={(e) =>
            setInputValue(_formatInputEntry(e.target.value, inputProps))
          }
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          {!hideBackButton && (
            <Button
              type="button"
              // onClick={onBack}
              variant="ghost"
              className="order-2 flex-1 justify-center rounded-xl py-3 sm:order-1"
              icon={ArrowLeft}
              onClick={onBack}
            >
              Voltar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="order-1 flex-1 sm:order-2"
            icon={submitButtonProps?.emojiIcon ? ArrowRight : undefined}
            disabled={!inputValue}
          >
            {submitButtonProps?.label ?? 'Próximo'}
            {submitButtonProps?.emojiIcon}
          </Button>
        </div>
      </form>
    </div>
  )
}
