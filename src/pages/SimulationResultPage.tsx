import {
  CalendarClock,
  CreditCard,
  Goal,
  Landmark,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AIInsightsCard } from '@/components/features/simulationResults/AIInsightCard'
import { Card } from '@/components/features/simulationResults/Card'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { formatCurrency } from '@/utils/currency'
import { calculateMonthSavings } from '@/utils/simulations'

export function SimulationResultPage() {
  const { getFormData } = useSimulationStorage()
  const { id } = useParams<{ id: string }>()

  const data = id ? getFormData(id) : null

  if (!data) return <h2>404 Error: Simulation not found</h2>

  const monthSavings = calculateMonthSavings(data)
  const monthSavingsStr = `${monthSavings},00`
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos"
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={`${data.goalAmount}`}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle={'Prazo para atingir a meta'}
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${formatCurrency(monthSavingsStr)}`}
          subtitle={'Valor mensal disponível'}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AIInsightsCard simulationId={data.id} />
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            icon={Wallet}
            label="RendaMensal"
            value={data.income}
            subtitle={'Renda total bruta por mês'}
          />
          <Card
            icon={CreditCard}
            label="Custos Fixos de Vida"
            value={data.expenses}
            subtitle={'Gastos essenciais por mês'}
          />
          <Card
            icon={Landmark}
            label="Dividas / Parcelas"
            value={data.debts}
            subtitle={'Valor comprometido em parcelas/deposito'}
          />
        </div>
      </div>
    </main>
  )
}
