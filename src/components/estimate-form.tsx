"use client"

import {
  BrushCleaning,
  FileDownIcon,
  FilePlus,
  LoaderCircle,
  Percent,
  Plus,
  Trash,
} from "lucide-react"
import { EstimateProps, PersonProps } from "@/types/estimates.types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import { CategoryProps } from "@/types/categories.types"
import { Checkbox } from "./ui/checkbox"
import CurrencyInput from "react-currency-input-field"
import CustomInput from "./custom-input"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "./ui/date-picker"
import DialogAdaptative from "./adaptative-dialog"
import { ErrorResponseProps } from "@/types/responses.types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Service as PDFService } from "@/services/pdf.service"
import { SelectWithSearch } from "./ui/select-with-search"
import { Service } from "@/services/estimates.service"
import Warning from "./warning"
import { cn } from "@/lib/utils"
import revalidate from "@/lib/actions"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { useForm } from "react-hook-form"
import { useServicesController } from "@/hooks/use-services"

interface Props {
  categories: CategoryProps[]
  defaultData?: EstimateProps
}

type FORM_STATUS = "pending" | "processing" | "success"

interface AuxiliarEstimateProps extends EstimateProps, PersonProps {
  discount: number
}

export function EstimateForm({ categories, defaultData }: Props) {
  const [status, setStatus] = useState<FORM_STATUS>("pending")

  const temporalStoredEstimate = JSON.parse(
    localStorage.getItem("temp_estimate") || "{}"
  ) as AuxiliarEstimateProps

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateProps>({
    defaultValues: defaultData
      ? { person: defaultData.person }
      : {
          person: {
            firstName:
              temporalStoredEstimate?.person?.firstName ??
              temporalStoredEstimate.firstName,
            lastName:
              temporalStoredEstimate?.person?.lastName ??
              temporalStoredEstimate.lastName,
          },
        },
  })

  const isDateRangeStored =
    temporalStoredEstimate?.from && temporalStoredEstimate?.to

  const [dateRange, setDateRange] = useState<DateRange | null>(
    defaultData
      ? { from: new Date(defaultData.from), to: new Date(defaultData.to) }
      : isDateRangeStored && {
          from: new Date(temporalStoredEstimate.from),
          to: new Date(temporalStoredEstimate.to),
        }
  )
  const [dateRangeError, setDateRangeError] = useState(false)

  const [servicesError, setServicesError] = useState(false)
  const [extraServicesError, setExtraServicesError] = useState(false)

  const [totalCost, setTotalCost] = useState(0)

  const defaultSelectedServices = defaultData?.services.filter(
    (s) =>
      s.category.toLowerCase() !== "extra" &&
      s.category.toLowerCase() !== "material"
  )
  const defaultExtraSelectedServices = defaultData?.services.filter(
    (s) =>
      s.category.toLowerCase() === "extra" ||
      s.category.toLowerCase() === "material"
  )

  const {
    selectedServices,
    areEmptySelectedServices,
    handleChangeServiceCost,
    addService,
    deleteService,
    handleChangeSelectValue,
    handleChangeServiceQuantity,
    handleApplyDiscount,
    handleUpdateSelectedServicesOnLocalStorage,
    clearAll,
  } = useServicesController("services_temp", defaultSelectedServices)

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
  } = useServicesController(
    "extra_services_temp",
    defaultExtraSelectedServices,
    true
  )

  useEffect(() => {
    if (!defaultData)
      handleUpdateSelectedServicesOnLocalStorage("services_temp")
  }, [selectedServices])

  useEffect(() => {
    if (!defaultData)
      extraHandleUpdateSelectedServicesOnLocalStorage("extra_services_temp")
  }, [extraSelectedServices])

  const [createdEstimate, setCreatedEstimated] = useState<EstimateProps>()

  const resetForm = () => {
    localStorage.removeItem("temp_estimate")
    localStorage.removeItem("services_temp")
    localStorage.removeItem("extra_services_temp")
  }

  const onSubmit = async (formData: EstimateProps) => {
    if (!dateRange?.from || !dateRange?.to) {
      setDateRangeError(true)
      return
    }

    if (extraAreEmptySelectedServices) {
      setExtraServicesError(true)

      return
    }

    if (
      selectedServices.filter((i) => i._id).length === 0 &&
      extraSelectedServices.length === 0
    ) {
      toast.error("Debes seleccionar al menos un servicio.")

      return
    }

    const PAYLOAD: EstimateProps = {
      ...formData,
      from: dateRange.from,
      to: dateRange.to,
      services: [
        ...selectedServices
          .filter((item) => item._id)
          .map((item) => ({ ...item, _id: undefined })),
        ...extraSelectedServices.map((item) => ({ ...item, _id: undefined })),
      ],
      totalCost,
    }

    try {
      setStatus("processing")

      const lastEstimate = !defaultData
        ? await Service.generateEstimate(PAYLOAD)
        : await Service.updateEstimate(defaultData?._id as string, PAYLOAD)

      setCreatedEstimated(lastEstimate)

      await revalidate("estimates")

      toast.success(
        `Prespuesto ${!defaultData ? "creado" : "actualizado"} con éxito`,
        { position: "top-center" }
      )
      setStatus("success")

      resetForm()
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

  const handleLocalStorage = (
    key: keyof EstimateProps | keyof PersonProps | keyof { discount: number },
    value: EstimateProps[keyof EstimateProps]
  ) => {
    const temporalEstimate = localStorage.getItem("temp_estimate")
    if (!temporalEstimate)
      localStorage.setItem(
        "temp_estimate",
        JSON.stringify({
          [key]: value,
        } as Partial<EstimateProps>)
      )
    else {
      const estimate: EstimateProps = JSON.parse(temporalEstimate)

      const updated: EstimateProps = {
        ...estimate,
        [key]: value,
      }

      localStorage.setItem("temp_estimate", JSON.stringify(updated))
    }
  }

  const handleStrings = useDebouncedCallback(
    (key: keyof EstimateProps | keyof PersonProps, value: string) =>
      handleLocalStorage(key, value),
    300
  )

  const [showPDF, setShowPDF] = useState(false)

  const handleDiscount = useDebouncedCallback((value: number) => {
    setDiscount(value)
    handleApplyDiscount(value)
    handleLocalStorage("discount", value)
  }, 200)

  const [discount, setDiscount] = useState(
    +temporalStoredEstimate?.discount || 40
  )

  return (
    <form
      className="relative flex flex-col gap-4 px-4 pt-2 pb-4 overflow-y-auto md:pb-0 md:px-0"
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
              disabled={status === "success"}
              onChange={({ target }) =>
                handleStrings("firstName", target.value.trim())
              }
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
              disabled={status === "success"}
              onChange={({ target }) =>
                handleStrings("lastName", target.value.trim())
              }
            />
          }
          error={errors?.person?.lastName?.message}
        />
      </div>
      <div className="relative flex w-full items-center justify-between gap-4">
        <Label htmlFor="date-range">Fecha</Label>
        {dateRangeError && <Warning message="Seleccioná un rango de fechas" />}
      </div>
      <DateRangePicker
        date={dateRange!}
        setDate={(selectedRange) => {
          setDateRange(selectedRange!)
          handleLocalStorage("from", selectedRange?.from)
          handleLocalStorage("to", selectedRange?.to)
        }}
        placeholder="Seleccioná el rango de fechas estimativo"
        align="start"
        disabled={status === "success"}
      />
      <div className="flex flex-col gap-4">
        <aside className="flex items-center gap-2 self-end">
          <Label>Descuento sobre Electro Instalador</Label>
          <div className="relative flex items-center max-w-16">
            <Percent className="absolute size-4 end-0 mr-3" />
            <Input
              defaultValue={discount}
              type="number"
              min={0}
              className="text-sm"
              placeholder="1"
              onChange={({ target }) => handleDiscount(Number(target.value))}
            />
          </div>
        </aside>
        <aside className="flex items-center justify-between gap-4">
          <Label className="grow">Servicios (Electro Instalador)</Label>
          {servicesError && <Warning message="Incompleto" />}
          <Button
            variant={"destructive"}
            size={"icon"}
            type="button"
            onClick={clearAll}
            disabled={status === "success"}
          >
            <BrushCleaning />
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={addService}
            disabled={status === "success"}
          >
            <Plus />
            Ítem
          </Button>
        </aside>
        <ul className="flex flex-col gap-4 md:max-h-[140px] overflow-y-auto">
          {selectedServices.map((selectedService, index) => (
            <li
              className="flex items-center flex-row justify-between gap-4"
              key={`selected_services_${index}`}
            >
              <SelectWithSearch
                data={categories}
                value={`${selectedService.id}_${selectedService.description}_${selectedService.type}`}
                handleChangeSelectValue={handleChangeSelectValue}
                index={index}
                selectedServices={selectedServices}
                disabled={status === "success"}
                appliedDiscount={discount}
              />
              <div className="relative flex items-center !w-32">
                <span
                  className={cn(
                    "absolute pl-3 pt-0.5",
                    !selectedService._id || status === "success"
                      ? "opacity-50"
                      : "opacity-100"
                  )}
                >
                  $
                </span>
                <CurrencyInput
                  disabled={!selectedService.id || status === "success"}
                  defaultValue={selectedService?.cost || 0}
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
                      selectedService.id as string
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
                placeholder={selectedService.quantity?.toString() ?? "1"}
                onChange={({ target }) =>
                  handleChangeServiceQuantity(
                    Number(target.value) < 1 ? 1 : Number(target.value),
                    selectedService.id as string
                  )
                }
                disabled={!selectedService.id || status === "success"}
              />
              <Button
                size={"icon"}
                type="button"
                disabled={selectedServices.length <= 1 || status === "success"}
                onClick={() => deleteService(index)}
              >
                <Trash />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-data-pdf"
          checked={showPDF}
          onCheckedChange={() => setShowPDF(!showPDF)}
          disabled={status === "success"}
        />
        <Label htmlFor="show-data-pdf">Mostrar PDF de AAIERIC</Label>
      </div>
      {showPDF && (
        <iframe
          src={process.env.NEXT_PUBLIC_IFRAME_DATA_URL!}
          className="w-full h-44 rounded-md"
        ></iframe>
      )}
      <div className="flex flex-col gap-4">
        <aside className="flex items-center justify-between gap-4">
          <Label className="grow">Extras</Label>
          {extraServicesError && <Warning message="Incompleto" />}
          <Button
            variant={"destructive"}
            size={"icon"}
            type="button"
            onClick={extraClearAll}
            disabled={status === "success"}
          >
            <BrushCleaning />
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={extraAddService}
            disabled={status === "success"}
          >
            <Plus />
            Extra
          </Button>
        </aside>
        <ul className="flex flex-col gap-4 md:max-h-48 overflow-y-auto">
          {extraSelectedServices.length === 0 ? (
            <li className="font-thin text-sm w-full flex items-center gap-2">
              <span className="h-0.5 w-full bg-muted"></span>
              <p className="text-nowrap opacity-50">Ningún extra agregado</p>
              <span className="h-0.5 w-full bg-muted"></span>
            </li>
          ) : (
            extraSelectedServices.map((extraService, index) => (
              <li
                className="flex flex-col gap-4 w-full"
                key={`extra_services_${index}`}
              >
                <div className="flex items-center gap-4 w-full">
                  <Input
                    type="text"
                    placeholder="Ej: Combustible"
                    className="text-sm min-w-0 w-[17rem] grow"
                    value={extraService.description}
                    onChange={({ target }) =>
                      extraHandleChangeSelectValue(
                        {
                          _id: `extra_${index}`,
                          id: `extra_${index}`,
                          description: target.value,
                          category: extraService.category || "Extra",
                          type: "-",
                          cost: extraService.cost,
                          originalCost: extraService.originalCost,
                        },
                        index
                      )
                    }
                    disabled={status === "success"}
                  />
                  <Button
                    size={"icon"}
                    type="button"
                    onClick={() => extraDeleteService(index)}
                    disabled={status === "success"}
                  >
                    <Trash />
                  </Button>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <div className="relative flex items-center">
                    <span
                      className={cn(
                        "absolute pl-3 pt-0.5",
                        !extraService.id || status === "success"
                          ? "opacity-50"
                          : "opacity-100"
                      )}
                    >
                      $
                    </span>
                    <CurrencyInput
                      disabled={!extraService.id || status === "success"}
                      defaultValue={extraService?.cost || 0}
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
                          extraService.id as string
                        )
                      }}
                      decimalSeparator=","
                      groupSeparator="."
                    />
                  </div>
                  <Input
                    type="number"
                    min={1}
                    className="text-center text-sm max-w-14"
                    placeholder={extraService.quantity?.toString() ?? "1"}
                    onChange={({ target }) =>
                      extraHandleChangeServiceQuantity(
                        Number(target.value) < 1 ? 1 : Number(target.value),
                        extraService.id as string
                      )
                    }
                    disabled={!extraService.description || status === "success"}
                  />
                  <Select
                    onValueChange={(value) => {
                      extraHandleChangeSelectValue(
                        {
                          _id: `extra_${index}`,
                          id: `extra_${index}`,
                          description: extraService.description,
                          category: value,
                          type: "-",
                          cost: extraService.cost,
                          originalCost: extraService.originalCost,
                        },
                        index
                      )
                    }}
                    defaultValue={extraService.category || "Material"}
                  >
                    <SelectTrigger className="grow cursor-pointer">
                      <SelectValue placeholder="Material" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        <SelectItem
                          value="Material"
                          className="hover:bg-accent cursor-pointer"
                        >
                          Material
                        </SelectItem>
                        <SelectItem
                          value="Extra"
                          className="hover:bg-accent cursor-pointer"
                        >
                          Extra
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="grid place-items-center gap-4 grid-cols-6">
        <Button
          type="reset"
          variant={"secondary"}
          onClick={() => {
            resetForm()
            clearAll()
            extraClearAll()
            setDateRange(null)
          }}
          className="col-span-2 w-full"
        >
          <BrushCleaning /> Limpiar
        </Button>
        <Button
          type={status === "success" ? "button" : "submit"}
          onClick={() => {
            if (status === "success")
              if (createdEstimate)
                PDFService.generatePDF(createdEstimate as EstimateProps)
          }}
          disabled={status === "processing"}
          className="font-bold sticky bottom-0 w-full col-span-4"
        >
          {status === "pending" ? (
            <>
              {!defaultData ? "Crear" : "Modificar"}
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
      </div>
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
