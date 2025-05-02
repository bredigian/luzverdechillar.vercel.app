import { FC, ReactNode } from "react"

import { Label } from "./ui/label"

interface Props {
  label: string
  customInput: ReactNode
}

export default function CustomInput({ label, customInput }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {customInput}
    </div>
  )
}
