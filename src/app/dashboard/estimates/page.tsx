import { Button } from "@/components/ui/button"
import EstimateFormDialog from "@/components/estimate-form"
import Screen from "@/components/layout/screen"
import { Service } from "@/services/categories.service"

export default async function EstimatesPage() {
  const categories = await Service.getCategories()

  console.log(categories)

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
    </Screen>
  )
}
