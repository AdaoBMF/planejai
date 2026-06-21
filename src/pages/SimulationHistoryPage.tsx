import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/features/simulationHistory/Card'
import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => {
    const sims = getAllSimulations()

    if (!sims.length) return []
    return sims
  })

  const onDeleteSimulation = (id: string) => {
    setIsLoading(true)

    const updatedStorage = deleteSimulation(id)

    setSimulations(updatedStorage)
    setIsLoading(false)
  }

  if (isLoading) {
    return <h1>Carregando...</h1>
  }

  if (!simulations.length) {
    return (
      <div>
        <h3>Você ainda não tem nenhuma simulação</h3>
        <Button
          variant="secondary"
          icon={TrendingUp}
          onClick={() => void navigate('/')}
        >
          <span className="hidden sm:inline">Nova Simulação</span>
        </Button>
      </div>
    )
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:gap-6 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros"
      />
      {simulations.map((sim) => {
        return (
          <div key={sim.id}>
            <Card simulation={sim} onClick={onDeleteSimulation} />
          </div>
        )
      })}
    </main>
  )
}
