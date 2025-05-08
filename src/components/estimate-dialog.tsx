"use client"

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
import { FileDown } from "lucide-react"
import { Service } from "@/services/pdf.service"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"

interface Props {
  data: EstimateProps
}

export default function EstimatePDFDialog({ data }: Props) {
  const [pdfURL, setPDFUrl] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const personFullname = `${data.person.firstName} ${data.person.lastName}`

  const handleDownloadPDF = () => {
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
          <Button type="button" onClick={handleDownloadPDF}>
            <FileDown />
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
