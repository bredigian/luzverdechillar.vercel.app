import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

import { Button } from "./button"
import { CategoryProps } from "@/types/categories.types"
import { ServiceProps } from "@/types/services.types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Props {
  data: CategoryProps[]
  value?: string
  index: number
  handleChangeSelectValue: (value: ServiceProps, index: number) => void
  selectedServices: ServiceProps[]
  disabled?: boolean
  appliedDiscount: number
}

export function SelectWithSearch({
  data,
  value,
  index,
  handleChangeSelectValue,
  selectedServices,
  disabled,
  appliedDiscount,
}: Props) {
  const [open, setOpen] = useState(false)

  const [valueId, valueDescription, valueType] = value?.split("_") ?? []

  const selectedService =
    valueId && valueDescription && valueType
      ? data
          .find((item) => item.services.find((s) => s._id === valueId))
          ?.services.find(
            (s) =>
              s.description.toLowerCase().trim() ===
                valueDescription.toLowerCase().trim() &&
              s.type.toLowerCase().trim() === valueType.toLowerCase().trim()
          )
      : null

  const text = selectedService
    ? `${selectedService?.type.substring(0, 3)}. ${
        selectedService?.description
      }`
    : "Servicio"

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-0 w-32 grow justify-between"
          disabled={disabled}
        >
          <div className="flex flex-col items-start gap-0.5 truncate">
            {selectedService && (
              <span className="text-[10px] leading-2 opacity-50 truncate">
                {selectedService?.category}
              </span>
            )}
            <span className="leading-4 w-max truncate max-w-full">
              {value ? text : "Selecciona un servicio..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[305px] h-[220px] md:h-fit p-0"
      >
        <Command>
          <CommandInput
            placeholder="Busca un servicio..."
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún servicio.</CommandEmpty>
            {data.map((category) => {
              return (
                <CommandGroup heading={category.name} key={category._id}>
                  {category.services.map((service) => {
                    const isDisabled = selectedServices.find(
                      (s) =>
                        s.id === service._id &&
                        s.type === service.type &&
                        s.description === service.description
                    )
                      ? true
                      : false

                    return (
                      <CommandItem
                        key={service._id}
                        value={`${category.name}${service.description}${service.type}`}
                        onSelect={() => {
                          handleChangeSelectValue(
                            {
                              ...service,
                              cost:
                                ((100 - appliedDiscount) * service.cost!) / 100,
                              originalCost: service.cost,
                              category: category.name,
                            },
                            index
                          )
                          setOpen(false)
                        }}
                        className="flex items-center justify-between cursor-pointer"
                        disabled={disabled || isDisabled}
                      >
                        <span>
                          {service.description}{" "}
                          <strong>({service.type})</strong>
                        </span>
                        <div className="ml-auto flex flex-col items-end gap-1">
                          <span className="">
                            {Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 0,
                            }).format(service.cost as number)}
                          </span>
                          <span className="text-xs opacity-50">(100%)</span>
                        </div>
                        <Check
                          className={cn(
                            "size-4",
                            valueId === service._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
