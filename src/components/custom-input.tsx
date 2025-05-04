import { FC, ReactNode } from "react"

import InputWarning from "./warning"
import { Label } from "./ui/label"

interface Props {
  label: string
  customInput: ReactNode
  error?: string
  id: string
}

export default function CustomInput({ label, customInput, error, id }: Props) {
  return (
    <div className="relative flex flex-col gap-4">
      <Label htmlFor={id}>{label}</Label>
      {customInput}
      {error && (
        <InputWarning
          message={error}
          className="absolute top-0 -translate-y-1 self-end"
        />
      )}
    </div>
  )
}
