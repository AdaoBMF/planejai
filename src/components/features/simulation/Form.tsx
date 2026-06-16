import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { type SimulationFormData, simulationFormSteps } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

import { FormStep } from './FormStep'
import { StepProgress } from './Progress'

export function SimulationForm() {
  const { saveFormData } = useSimulationStorage()
  const navigate = useNavigate()
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [formData, setFormData] = useState({} as SimulationFormData)

  const totalSteps = simulationFormSteps.length
  const formStep = simulationFormSteps[currentStepIdx]
  const handleNextStep = (value: string) => {
    const updatedFormData = { ...formData, [formStep.id]: value }
    setFormData(updatedFormData)
    console.log({ updatedFormData })

    if (currentStepIdx + 1 > totalSteps - 1) {
      const id = saveFormData(updatedFormData)
      navigate(`/resultado/${id}`)
      return
    }

    setCurrentStepIdx((idx) => idx + 1)
  }
  const handlePreviousStep = () => {
    if (currentStepIdx <= 0) return

    setCurrentStepIdx((idx) => idx - 1)
  }

  return (
    <div>
      <StepProgress currentStep={currentStepIdx + 1} totalSteps={totalSteps} />
      <FormStep
        key={formStep.id}
        {...formStep}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
        hideBackButton={currentStepIdx === 0}
      />
    </div>
  )
}
