import { X } from 'lucide-react'
import type { PropsWithChildren } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: (action?: boolean) => void
}

export const Modal = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<ModalProps>) => {
  if (!isOpen) return undefined
  return (
    <div className="modal-overlay bg-card flex h-50 w-100 flex-col text-center">
      <div className="modal-content bg-foreground rounded-t-8">
        <div className="bg-primary mt-[-2] flex h-6 w-full items-center rounded-t-md p-2">
          <X
            size={16}
            className="text-muted-foreground ml-auto cursor-pointer"
            onClick={() => onClose(false)}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
