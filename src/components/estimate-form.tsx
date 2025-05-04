"use client"

import {
  BrushCleaning,
  FileDownIcon,
  FilePlus,
  LoaderCircle,
  Plus,
  Trash,
} from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import CurrencyInput, { formatValue } from "react-currency-input-field"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import { CategoryProps } from "@/types/categories.types"
import CustomInput from "./custom-input"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "./ui/date-picker"
import DialogAdaptative from "./adaptative-dialog"
import { ErrorResponseProps } from "@/types/responses.types"
import { EstimateProps } from "@/types/estimates.types"
import { Input } from "./ui/input"
import InputWarning from "./warning"
import { Label } from "./ui/label"
import { SelectWithSearch } from "./ui/select-with-search"
import { Service } from "@/services/estimates.service"
import Warning from "./warning"
import { cn } from "@/lib/utils"
import revalidate from "@/lib/actions"
import { toast } from "sonner"
import { useServicesController } from "@/hooks/use-services"

interface Props {
  categories: CategoryProps[]
}

type FORM_STATUS = "pending" | "processing" | "success"

function EstimateForm({ categories }: Props) {
  const [status, setStatus] = useState<FORM_STATUS>("pending")

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateProps>()

  const [dateRange, setDateRange] = useState<DateRange>()
  const [dateRangeError, setDateRangeError] = useState(false)

  const [servicesError, setServicesError] = useState(false)
  const [extraServicesError, setExtraServicesError] = useState(false)

  const [totalCost, setTotalCost] = useState(0)

  const {
    selectedServices,
    areEmptySelectedServices,
    handleChangeServiceCost,
    addService,
    deleteService,
    handleChangeSelectValue,
    handleChangeServiceQuantity,
    handleUpdateSelectedServicesOnLocalStorage,
    clearAll,
  } = useServicesController()

  const {
    selectedServices: extraSelectedServices,
    areEmptySelectedServices: extraAreEmptySelectedServices,
    handleChangeServiceCost: extraHandleChangeServiceCost,
    addService: extraAddService,
    deleteService: extraDeleteService,
    handleChangeSelectValue: extraHandleChangeSelectValue,
    handleChangeServiceQuantity: extraHandleChangeServiceQuantity,
    handleUpdateSelectedServicesOnLocalStorage:
      extraHandleUpdateSelectedServicesOnLocalStorage,
    clearAll: extraClearAll,
  } = useServicesController(true)

  const onSubmit = async (formData: EstimateProps) => {
    if (!dateRange?.from || !dateRange?.to) {
      setDateRangeError(true)
      return
    }
    if (areEmptySelectedServices) {
      setServicesError(true)
      if (extraAreEmptySelectedServices) {
        setExtraServicesError(true)
      }

      return
    }

    if (extraAreEmptySelectedServices) {
      setExtraServicesError(true)
      return
    }

    const PAYLOAD: EstimateProps = {
      ...formData,
      from: dateRange.from,
      to: dateRange.to,
      services: [
        ...selectedServices.map((item) => ({ ...item, _id: undefined })),
        ...extraSelectedServices.map((item) => ({ ...item, _id: undefined })),
      ],
      totalCost,
    }

    try {
      setStatus("processing")
      await Service.generateEstimate(PAYLOAD)
      setStatus("success")
      await revalidate("estimates")
    } catch (e) {
      setStatus("pending")

      const { message } = e as ErrorResponseProps
      toast.error(message, { position: "top-center" })
    }
  }

  useEffect(() => {
    if (!areEmptySelectedServices) setServicesError(false)
    if (!extraAreEmptySelectedServices) setExtraServicesError(false)

    const totalServices = selectedServices.reduce((acc, service) => {
      if (service.cost)
        return acc + Number(service.cost) * (service?.quantity as number)
      return acc
    }, 0)

    const totalExtras = extraSelectedServices.reduce((acc, service) => {
      if (service.cost)
        return acc + Number(service.cost) * (service?.quantity as number)
      return acc
    }, 0)

    setTotalCost(totalServices + totalExtras)
  }, [selectedServices, extraSelectedServices])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to && dateRangeError)
      setDateRangeError(false)
  }, [dateRange])

  return (
    <form
      className="flex flex-col gap-4 px-4 pb-4"
      onSubmit={handleSubmit(onSubmit)}
      data-vaul-no-drag
    >
      <div className="flex items-center justify-between gap-4">
        <CustomInput
          label="Nombre"
          id="firstName"
          customInput={
            <Input
              id="firstName"
              {...register("person.firstName", {
                required: "Requerido",
              })}
              className="text-sm"
              type="text"
              placeholder="Ej: Juan"
            />
          }
          error={errors?.person?.firstName?.message}
        />
        <CustomInput
          label="Apellido"
          id="lastName"
          customInput={
            <Input
              id="lastName"
              {...register("person.lastName", {
                required: "Requerido",
              })}
              className="text-sm"
              type="text"
              placeholder="Ej: Pérez"
            />
          }
          error={errors?.person?.lastName?.message}
        />
      </div>
      <div className="relative flex w-full items-center justify-between gap-4">
        <Label>Fecha</Label>
        {dateRangeError && <Warning message="Seleccioná un rango de fechas" />}
      </div>
      <DateRangePicker
        date={dateRange}
        setDate={setDateRange}
        placeholder="Seleccioná el rango de fechas estimativo"
        align="start"
      />
      <div className="flex flex-col gap-4">
        <aside className="flex items-center justify-between gap-4">
          <Label className="grow">Servicios</Label>
          {servicesError && <Warning message="Incompleto" />}
          <Button
            variant={"destructive"}
            size={"icon"}
            type="button"
            onClick={clearAll}
          >
            <BrushCleaning />
          </Button>
          <Button variant={"outline"} type="button" onClick={addService}>
            <Plus />
            Ítem
          </Button>
        </aside>
        <ul className="flex flex-col gap-4 max-h-[140px] overflow-y-auto">
          {selectedServices.map((selectedService, index) => (
            <li
              className="flex items-center flex-row justify-between gap-4"
              key={`selected_services_${index}`}
            >
              <SelectWithSearch
                data={categories}
                value={`${selectedService._id}_${selectedService.description}_${selectedService.type}`}
                handleChangeSelectValue={handleChangeSelectValue}
                index={index}
                selectedServices={selectedServices}
              />
              <div className="relative flex items-center !w-32">
                <span
                  className={cn(
                    "absolute pl-3 pt-0.5",
                    !selectedService._id ? "opacity-50" : "opacity-100"
                  )}
                >
                  $
                </span>
                <CurrencyInput
                  disabled={!selectedService._id}
                  defaultValue={selectedService.cost ?? 0}
                  decimalsLimit={2}
                  allowDecimals={false}
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "pl-7"
                  )}
                  value={selectedService.cost ?? 0}
                  onValueChange={(_, __, values) =>
                    handleChangeServiceCost(
                      Number(values?.float),
                      selectedService._id as string
                    )
                  }
                  decimalSeparator=","
                  groupSeparator="."
                />
              </div>
              <Input
                type="number"
                min={1}
                className="text-center text-sm max-w-10 px-1"
                placeholder="1"
                onChange={({ target }) =>
                  handleChangeServiceQuantity(
                    Number(target.value) < 1 ? 1 : Number(target.value),
                    selectedService._id as string
                  )
                }
              />
              <Button
                size={"icon"}
                type="button"
                disabled={selectedServices.length <= 1}
                onClick={() => deleteService(index)}
              >
                <Trash />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <aside className="flex items-center justify-between gap-4">
          <Label className="grow">Extras</Label>
          {extraServicesError && <Warning message="Incompleto" />}
          <Button
            variant={"destructive"}
            size={"icon"}
            type="button"
            onClick={extraClearAll}
          >
            <BrushCleaning />
          </Button>
          <Button variant={"outline"} type="button" onClick={extraAddService}>
            <Plus />
            Extra
          </Button>
        </aside>
        <ul className="flex flex-col gap-4 max-h-[140px] overflow-y-auto">
          {extraSelectedServices.length === 0 ? (
            <li className="font-thin text-sm w-full flex items-center gap-2">
              <span className="h-0.5 w-full bg-muted"></span>
              <p className="text-nowrap opacity-50">Ningún extra agregado</p>
              <span className="h-0.5 w-full bg-muted"></span>
            </li>
          ) : (
            extraSelectedServices.map((extraService, index) => (
              <li
                className="flex items-center justify-between gap-4"
                key={`extra_services_${index}`}
              >
                <Input
                  type="text"
                  placeholder="Ej: Combustible"
                  className="text-sm min-w-0 w-[17rem] grow"
                  value={extraService.description}
                  onChange={({ target }) =>
                    extraHandleChangeSelectValue(
                      {
                        _id: `extra_${index}`,
                        description: target.value,
                        type: "Extra",
                        cost: extraService.cost,
                      },
                      index
                    )
                  }
                />
                <div className="relative flex items-center">
                  <span
                    className={cn(
                      "absolute pl-3 pt-0.5",
                      !extraService._id ? "opacity-50" : "opacity-100"
                    )}
                  >
                    $
                  </span>
                  <CurrencyInput
                    disabled={!extraService.description}
                    defaultValue={extraService.cost ?? 0}
                    decimalsLimit={2}
                    allowDecimals={false}
                    className={cn(
                      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      "pl-7"
                    )}
                    value={extraService.cost ?? 0}
                    onValueChange={(value, name, values) => {
                      extraHandleChangeServiceCost(
                        Number(values?.float),
                        extraService._id as string
                      )
                    }}
                    decimalSeparator=","
                    groupSeparator="."
                  />
                </div>
                <Input
                  type="number"
                  min={1}
                  className="text-center text-sm max-w-10"
                  placeholder="1"
                  onChange={({ target }) =>
                    extraHandleChangeServiceQuantity(
                      Number(target.value) < 1 ? 1 : Number(target.value),
                      extraService._id as string
                    )
                  }
                />
                <Button
                  size={"icon"}
                  type="button"
                  onClick={() => extraDeleteService(index)}
                >
                  <Trash />
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
      <Button
        type={status === "success" ? "button" : "submit"}
        onClick={() => {
          if (status === "success") console.log("Exportando...")
        }}
        disabled={status === "processing"}
        className="font-bold"
      >
        {status === "pending" ? (
          <>
            Crear prespuesto
            <strong>
              {Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              }).format(totalCost)}
            </strong>
          </>
        ) : status === "processing" ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>
            Exportar como PDF <FileDownIcon />
          </>
        )}
      </Button>
    </form>
  )
}

export default function EstimateFormDialog({ categories }: Props) {
  return (
    <DialogAdaptative
      title="Nuevo prespuesto"
      description="Completá el siguiente formulario y generá tu presupuesto."
      triggerButtonText="Crear"
      icon={<FilePlus />}
    >
      <EstimateForm categories={categories} />
    </DialogAdaptative>
  )
}
