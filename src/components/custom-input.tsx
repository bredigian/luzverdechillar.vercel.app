import InputWarning from "./warning"
import { Label } from "./ui/label"
import { ReactNode } from "react"

interface Props {
  label?: string
  customInput: ReactNode
  error?: string
  id: string
}

export default function CustomInput({ label, customInput, error, id }: Props) {
  return (
    <div className="relative flex flex-col gap-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      {customInput}
      {error && (
        <InputWarning
          message={error}
          className="self-end max-w-52 md:max-w-max truncate"
        />
      )}
    </div>
  )
}
