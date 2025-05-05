"use client"

import { ArrowRight, FileDown, Loader2, Settings2, Trash } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format, set } from "date-fns"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import DialogAdaptative from "./adaptative-dialog"
import { ErrorResponseProps } from "@/types/responses.types"
import { EstimateProps } from "@/types/estimates.types"
import { Service as EstimatesService } from "@/services/estimates.service"
import Image from "next/image"
import { Service } from "@/services/pdf.services"
import { Skeleton } from "./ui/skeleton"
import logo from "@/assets/logo.webp"
import revalidate from "@/lib/actions"
import { toast } from "sonner"
import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

type FORM_STATUS = "pending" | "processing" | "success"

function DeleteEstimate({ _id }: { _id: EstimateProps["_id"] }) {
  const [status, setStatus] = useState<FORM_STATUS>("pending")
  const { open, setOpen, handleOpen } = useDialog()

  const handleDelete = async () => {
    try {
      setStatus("processing")

      await EstimatesService.deleteEstimate(_id)

      setStatus("success")
      toast.success("Presupuesto eliminado con éxito", {
        position: "top-center",
      })
      handleOpen()
      setTimeout(async () => {
        await revalidate("estimates")
      }, 1000)
    } catch (error) {
      setStatus("pending")

      const { message } = error as ErrorResponseProps
      toast.error(message, { position: "top-center" })
    }
  }

  return (
    <DialogAdaptative
      triggerButtonText="Eliminar"
      icon={<Trash />}
      title="¿Estás seguro?"
      description="Esta acción no se puede deshacer"
      variant={"destructive"}
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant={"destructive"}
        className="mx-4 mb-4 md:m-0 md:w-fit md:ml-auto"
        onClick={handleDelete}
        disabled={status === "processing" || status === "success"}
      >
        {status === "pending" ? (
          <>Eliminar</>
        ) : status === "processing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>Eliminado</>
        )}
      </Button>
    </DialogAdaptative>
  )
}

interface Props {
  data: EstimateProps
}

export default function EstimateItem({ data }: Props) {
  const personFullname = `${data.person.firstName} ${data.person.lastName}`
  const dateFromString = format(data.from, "dd/MM/yyyy").toString()
  const dateToString = format(data.to, "dd/MM/yyyy").toString()
  const totalCostString = Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(data.totalCost)

  const createdAtString = format(
    data.createdAt as Date,
    "dd/MM/yyyy"
  ).toString()

  return (
    <li className="col-span-full lg:col-span-2 2xl:col-span-1">
      <Card className="w-full bg-card/50 hover:bg-card/100 duration-200 ease-in-out">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4 truncate">
            <span className="grow truncate">{personFullname}</span>
            <Badge variant={"default"}>{totalCostString}</Badge>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                >
                  <Settings2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="max-w-fit flex flex-col items-end gap-4"
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
              >
                <span className="text-sm font-semibold">Opciones</span>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={"secondary"}
                    onClick={() => Service.generatePDF(data)}
                  >
                    <FileDown /> Exportar PDF
                  </Button>
                  <DeleteEstimate _id={data._id} />
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <CardDescription hidden></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Badge variant={"secondary"}>
            <span>{dateFromString}</span>
            <ArrowRight className="size-4" />
            <span>{dateToString}</span>
          </Badge>
          <Badge variant={"outline"} className="font-extralight opacity-50">
            Creado el {createdAtString}
          </Badge>
        </CardContent>
        <CardFooter hidden>
          <Image
            id="luz_verde_chillar_logo"
            hidden
            alt="Logo auxiliar de Luz Verde Chillar"
            src={logo}
          />
        </CardFooter>
      </Card>
    </li>
  )
}

export const EstimateItemSkeleton = () => {
  return (
    <li className="col-span-full lg:col-span-2 2xl:col-span-1">
      <Card className="bg-card/50 hover:bg-card/100 duration-200 ease-in-out">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-5" />
          </CardTitle>
          <CardDescription hidden></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="w-54 h-5" />
          <Skeleton className="w-48 h-5" />
        </CardContent>
        <CardFooter hidden></CardFooter>
      </Card>
    </li>
  )
}
