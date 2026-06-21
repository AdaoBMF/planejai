import type { SimulationFormData, SimulationRecord } from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage ? (JSON.parse(storage) as SimulationRecord[]) : []

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record])
    )

    return id
  }

  const getAllSimulations = (): SimulationRecord[] => {
    const storage: string = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!storage) return []

    const simulations = JSON.parse(storage)

    return simulations as SimulationRecord[]
  }

  const getFormData = (id: string): SimulationRecord | null => {
    const storage: string = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!storage) return null

    const simulations = JSON.parse(storage) as SimulationRecord[]
    return simulations.find((sim) => sim.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord): void => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData = storage ? JSON.parse(storage) : []

    const updated = savedData.map((rec) => (rec.id === id ? { ...data } : rec))

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const deleteSimulation = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedData: SimulationRecord[] = storage?.length
      ? JSON.parse(storage)
      : []
    const dataWithoutRemovedSimulation = savedData.filter(
      (sim) => sim.id !== id
    )

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(dataWithoutRemovedSimulation)
    )

    return dataWithoutRemovedSimulation
  }

  return {
    saveFormData,
    getFormData,
    updateSimulation,
    getAllSimulations,
    deleteSimulation,
  }
}
