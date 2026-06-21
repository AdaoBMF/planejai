import { Goal, SquareArrowUpRight, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { SimulationRecord } from '@/data/simulation'
import { useBreakpoint } from '@/hooks/useBreakPoint'
import { calculateMonthSavings } from '@/utils/simulations'

interface CardProps {
  simulation: SimulationRecord
  onClick: (id: string) => void
}
interface SimulationItemsProps {
  label: string
  value: string
  customClasses?: string
}

function SimulationTitle({ label, value }: SimulationItemsProps) {
  return (
    <div className="flex flex-col sm:min-w-[120px]">
      <span className="text-sm font-semibold tracking-widest sm:tracking-normal">
        {label}
      </span>
      <span className="text-muted-foreground text-xs">{value}</span>
    </div>
  )
}

function SimulationDefaultItem({ label, value }: SimulationItemsProps) {
  return (
    <div className="flex flex-col sm:min-w-[100px]">
      <span className={'text-muted-foreground text-xs tracking-tight'}>
        {label}
      </span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  )
}

// const simulation: SimulationRecord = {
//   income: '5.000,00',
//   expenses: '2.000,00',
//   debts: '1.000,00',
//   goalName: 'Monitor novo',
//   goalAmount: '1.800,00',
//   goalDeadline: '6',
//   id: 'f5594f43-af36-4a8b-8d70-8c0fe3c4c180',
//   createdAt: '18/06/2026',
// }

export function Card({ simulation, onClick }: CardProps) {
  const navigate = useNavigate()
  const isDesktop = useBreakpoint('sm')
  const monthlySavings = calculateMonthSavings(simulation)

  const onGoToDetails = (simulationId: string) => {
    navigate(`/resultado/${simulationId}`)
  }

  return (
    <div className="bg-card text-primary-foreground ml-4 flex flex-col gap-4 rounded-2xl p-8 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:h-fit sm:w-full sm:flex-row sm:items-center sm:px-8 sm:py-4">
      <div className="flex grow flex-col gap-4 sm:mr-2 sm:min-w-fit sm:flex-row sm:justify-start sm:gap-12">
        <div className="bg-primary-foreground mb-4 flex max-h-10 min-h-10 max-w-10 min-w-10 items-center justify-center rounded-xl">
          <Goal size={16} className="text-primary" />
        </div>
        <SimulationTitle
          label={simulation.goalName}
          value={simulation.createdAt}
        />

        <SimulationDefaultItem
          label="CUSTO DA META"
          value={`R$ ${simulation.goalAmount}`}
        />

        <SimulationDefaultItem
          label="PRAZO"
          value={`${simulation.goalDeadline} meses`}
        />

        <SimulationDefaultItem
          label="ECONOMIA MENSAL"
          value={`R$ ${monthlySavings}`}
        />
      </div>

      <Divider
        orientation={!isDesktop ? 'horizontal' : 'vertical'}
        spacing={4}
      />

      <div className="flex w-fit flex-row items-center gap-8 rounded-xl">
        <Button
          icon={Trash2}
          variant="ghost"
          className="order-1 h-20 w-20 text-red-700"
          onClick={() => onClick(simulation.id)}
        />

        {!isDesktop && (
          <Divider orientation="vertical" spacing={10} className="order-2" />
        )}

        <Button
          variant={!isDesktop ? 'ghost' : 'secondary'}
          icon={SquareArrowUpRight}
          onClick={() => onGoToDetails(simulation.id)}
          className="order-3"
        >
          <span>ver detalhes</span>
        </Button>
      </div>
    </div>
  )
}
