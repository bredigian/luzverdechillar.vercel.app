import { Button } from "@/components/ui/button"
import EstimateFormDialog from "@/components/estimate-form"
import EstimatesContainer from "@/components/estimates-container"
import Screen from "@/components/layout/screen"
import { Service } from "@/services/categories.service"
import { Suspense } from "react"

export default async function EstimatesPage() {
  const categories = await Service.getCategories()

  return (
    <Screen className="flex-col gap-4">
      <aside className="flex items-start justify-between gap-4">
        <h1 className="font-thin">
          Administrá y genera nuevos presupuestos para tus clientes
        </h1>
        {"error" in categories ? (
          <Button disabled>No disponible</Button>
        ) : (
          <EstimateFormDialog categories={categories} />
        )}
      </aside>
      <Suspense fallback={<>Loading...</>}>
        <EstimatesContainer />
      </Suspense>
    </Screen>
  )
}
