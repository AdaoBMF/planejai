import { Button } from '@/components/shared/Button'

interface ChatErrorProps {
  onClose: (retry: boolean) => void
}

export const ChatError = ({ onClose }: ChatErrorProps) => {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-b-md p-4 font-semibold">
      <h3 className="text-orange-600">
        Ocorreu um erro ao enviar sua pergunta
      </h3>

      <p className="text-muted-foreground">
        O agente pode estar enfrentando instabilidades
      </p>

      <div className="mt-2 flex justify-around gap-2">
        <Button
          variant="secondary"
          title="Cancelar"
          onClick={() => onClose(false)}
          className="rounded-xg flex-1 justify-center py-3 text-orange-400"
        >
          Cancelar
        </Button>
        <Button
          variant="secondary"
          title="retry"
          onClick={() => onClose(true)}
          className="text-primary rounded-xg flex-1 justify-center py-3"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
