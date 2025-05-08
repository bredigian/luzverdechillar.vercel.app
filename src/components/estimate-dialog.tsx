"use client"

import { Check, FileDown, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { Button } from "./ui/button"
import { EstimateProps } from "@/types/estimates.types"
import { Service } from "@/services/pdf.service"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"

interface Props {
  data: EstimateProps
}

type STATE = "pending" | "processing" | "success"

export default function EstimatePDFDialog({ data }: Props) {
  const [pdfURL, setPDFUrl] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const [state, setState] = useState<STATE>("pending")

  const personFullname = `${data.person.firstName} ${data.person.lastName}`

  const handleDownloadPDF = () => {
    setState("processing")

    setTimeout(() => {
      if (pdfURL) {
        const createdAtString = format(
          data.createdAt as Date,
          "dd/MM/yyyy"
        ).toString()

        const link = document.createElement("a")
        link.href = pdfURL
        link.download = `LUZ_VERDE_CHILLAR_PRESUPUESTO_${createdAtString.replaceAll(
          "/",
          "-"
        )}_${personFullname.toUpperCase().replaceAll(" ", "_")}.pdf`

        link.click()
      }
      setState("success")
    }, 500)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          onClick={() => {
            setPDFUrl(Service.generatePDF(data, true))
          }}
        >
          <FileDown /> Mostrar PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Presupuesto - {personFullname}</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        {!isMobile ? (
          <iframe
            src={`${pdfURL}#toolbar=0`}
            title="Vista previa del PDF"
            className="border-0 w-full h-[40rem]"
          />
        ) : (
          <p className="font-thin">
            No se puede previsualizar el prespuesto en este dispositivo.
            Descargá el archivo con el botón de abajo.
          </p>
        )}

        <DialogFooter className="flex items-center flex-row justify-end">
          <DialogClose asChild>
            <Button variant={"outline"}>Cerrar</Button>
          </DialogClose>
          <Button
            disabled={state !== "pending"}
            type="button"
            onClick={handleDownloadPDF}
          >
            {state === "pending" ? (
              <>
                <FileDown />
                Descargar
              </>
            ) : state === "processing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Check /> Completado
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
