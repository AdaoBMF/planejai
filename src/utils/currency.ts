import type { InputProps } from '@/components/shared/Input'

export const formatCurrency = (value: string): string => {
  const digits = value.replace(/\D/g, '')

  if (!digits) return ''

  const number = Number(digits) / 100

  if (isNaN(number)) return ''

  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const isCurrencyInput = (inputProps: InputProps): boolean => {
  return inputProps.prefix === 'R$'
}

export const parseCurrency = (value: string): number => {
  return (
    parseFloat(value.replace(/\./g, '').replace(',', '.').replace('R$', '')) ||
    0
  )
}
