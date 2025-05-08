import { EstimateProps } from "@/types/estimates.types"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import jsPDF from "jspdf"
import { toast } from "sonner"

interface Props {
  generatePDF: (data: EstimateProps, generateURL?: boolean) => string | null
}

enum ORDER_PRIORITY {
  MATERIAL = 2,
  EXTRA = 3,
}

export const Service: Props = {
  generatePDF: (data, generateURL) => {
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

    const pdf = new jsPDF("p", "mm", "a4", true)

    try {
      pdf.addImage({
        imageData: document.getElementById(
          "luz_verde_chillar_logo"
        ) as HTMLImageElement,
        x: 95,
        y: 14,
        width: 20,
        height: 20,
      })

      pdf.setFontSize(10).text("Luz Verde Chillar", 105, 42, {
        align: "center",
      })

      pdf.setFontSize(11).text(`Fecha: ${createdAtString}`, 14, 56)

      pdf
        .setFontSize(11)
        .text("Presupuesto realizado por Yaco Mehring", 194, 56, {
          align: "right",
        })

      pdf.setFontSize(11).text(`Cliente: ${personFullname}`, 14, 64)

      pdf
        .setFontSize(11)
        .text(
          `Fechas estimativas de trabajo: ${dateFromString} al ${dateToString}`,
          14,
          72
        )

      pdf.setFontSize(11).text("Detalle", 14, 88)

      autoTable(pdf, {
        theme: "grid",
        head: [["Tipo", "Descripción", "Cantidad", "Precio uni.", "Subtotal"]],
        headStyles: { fillColor: "#f3f3f3", textColor: "#000000" },
        body: data.services
          .sort((a, b) => {
            const orderA: number =
              ORDER_PRIORITY[
                a.type.toUpperCase() as keyof typeof ORDER_PRIORITY
              ] || 1
            const orderB: number =
              ORDER_PRIORITY[
                b.type.toUpperCase() as keyof typeof ORDER_PRIORITY
              ] || 1

            return orderA - orderB
          })
          .map((service) => [
            service.type.toUpperCase(),
            service.description || "",
            service.quantity || 0,
            Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            }).format(service.cost as number),
            Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            }).format((service.cost as number) * (service.quantity as number)),
          ]),
        foot: [["", "", "", "TOTAL", totalCostString]],
        footStyles: { fillColor: "#000000" },
        startY: 96,
      })

      const pdfBlob = pdf.output("blob")
      const pdfURL = URL.createObjectURL(pdfBlob)

      if (!generateURL)
        pdf.save(
          `LUZ_VERDE_CHILLAR_PRESUPUESTO_${createdAtString.replaceAll(
            "/",
            "-"
          )}_${personFullname.toUpperCase().replaceAll(" ", "_")}.pdf`
        )

      return pdfURL
    } catch (e) {
      if (e instanceof Error) toast.error(e.message, { position: "top-center" })
      return null
    }
  },
}
