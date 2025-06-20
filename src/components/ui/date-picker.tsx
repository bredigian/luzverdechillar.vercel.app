import { DateRange, SelectRangeEventHandler } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// import InputWarning from "../warning"

interface Props {
  date?: DateRange
  setDate: SelectRangeEventHandler
  placeholder?: string
  align?: "start" | "end" | "center"
  disabled?: boolean
}

export function DateRangePicker({
  date,
  setDate,
  placeholder,
  align,
  disabled,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "col-span-1 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
          type="button"
          id="date-range"
        >
          <CalendarIcon />
          {date?.from && date?.to ? (
            `${format(date.from, "dd/MM/yyyy")} - ${format(
              date.to,
              "dd/MM/yyyy"
            )}`
          ) : (
            <p className="select-none">
              {placeholder ?? "Selecciona una fecha"}
            </p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align ?? "start"}>
        <Calendar
          initialFocus
          mode="range"
          selected={date}
          onSelect={setDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
