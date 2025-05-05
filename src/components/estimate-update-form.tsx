"use client"

import { ArrowRight, Edit, Loader2 } from "lucide-react"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"
import { FormEventHandler, useState } from "react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { DateRangePicker } from "./ui/date-picker"
import DialogAdaptative from "./adaptative-dialog"
import { ErrorResponseProps } from "@/types/responses.types"
import { EstimateProps } from "@/types/estimates.types"
import { Label } from "./ui/label"
import { Service } from "@/services/estimates.service"
import Warning from "./warning"
import { format } from "date-fns"
import revalidate from "@/lib/actions"
import { toast } from "sonner"
import { useDialog } from "@/hooks/use-dialog"

interface Props {
  data: EstimateProps
  handleDialog?: () => void
}

type FORM_STATUS = "pending" | "processing" | "success"

function EstimateUpdateForm({ data, handleDialog }: Props) {
  const dateFromActual = format(data.from as Date, "dd/MM/yyyy")
  const dateToActual = format(data.to as Date, "dd/MM/yyyy")

  const [dateRange, setDateRange] = useState<DateRange>({
    from: data.from,
    to: data.to,
  })
  const [dateRangeError, setDateRangeError] = useState(false)

  const [status, setStatus] = useState<FORM_STATUS>("pending")

  const handleUpdate: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!dateRange?.from || !dateRange?.to) {
      setDateRangeError(true)
      return
    }

    try {
      setStatus("processing")
      await Service.updateDates(data._id as string, dateRange)
      await revalidate("estimates")
      setStatus("success")
      toast.success("Las fechas fueron modificadas")
      handleDialog!()
    } catch (error) {
      setStatus("pending")
      const { message } = error as ErrorResponseProps
      toast.error(message, { position: "top-center" })
    }
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col gap-4 px-4 pb-4 md:px-0 md:pb-0"
      data-vaul-no-drag
    >
      <Badge variant={"secondary"}>
        Actual {dateFromActual} <ArrowRight /> {dateToActual}
      </Badge>
      <div className="relative flex w-full items-center justify-between gap-4">
        <Label>Fecha</Label>
        {dateRangeError && <Warning message="Seleccioná un rango de fechas" />}
      </div>
      <DateRangePicker
        date={dateRange}
        setDate={setDateRange as SelectRangeEventHandler}
        placeholder="Seleccioná el rango de fechas estimativo"
        align="start"
      />
      <Button
        type="submit"
        disabled={
          status === "processing" ||
          status === "success" ||
          (new Date(data.from).getTime() ===
            new Date(dateRange?.from as Date).getTime() &&
            new Date(data.to).getTime() ===
              new Date(dateRange?.to as Date).getTime())
        }
      >
        {status === "pending" ? (
          <>Actualizar</>
        ) : status === "processing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>Actualizado</>
        )}
      </Button>
    </form>
  )
}

export default function EstimateUpdateFormDialog({ data }: Props) {
  const personFullname = `${data.person.firstName} ${data.person.lastName}`
  const { open, setOpen, handleOpen } = useDialog()

  return (
    <DialogAdaptative
      open={open}
      onOpenChange={setOpen}
      title="Modificar fechas"
      description={`Actualizá las fechas para el prespuesto de ${personFullname}`}
      triggerButtonText="Modificar fechas"
      icon={<Edit />}
    >
      <EstimateUpdateForm data={data} handleDialog={handleOpen} />
    </DialogAdaptative>
  )
}
