"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface Props {
  defaultValue?: string
  className?: string
}

export default function FilterSelector({ defaultValue, className }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleFilter = (value: string) => {
    const parsedValue = value.trim()
    const params = new URLSearchParams(searchParams)
    if (parsedValue) params.set("status", parsedValue.toLowerCase())
    else params.delete("status")

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select onValueChange={handleFilter} defaultValue={defaultValue}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Filtrar" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Presupuestos</SelectLabel>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="completed">Completados</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
