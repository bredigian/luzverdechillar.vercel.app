import EstimatesContainer, {
  EstimatesContainerSkeleton,
} from "@/components/estimates-container"

import { Button } from "@/components/ui/button"
import { CategoryProps } from "@/types/categories.types"
import EstimateFormDialog from "@/components/estimate-form"
import Finder from "@/components/finder"
import { Loader2 } from "lucide-react"
import { Service } from "@/services/categories.service"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ filter: string }>
}

export default async function EstimatesPage({ searchParams }: Props) {
  const categories = await Service.getCategories()

  const { filter } = await searchParams

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="font-thin">
        Administrá y genera nuevos presupuestos para tus clientes
      </h1>
      <aside className="flex items-start justify-between gap-4">
        <Finder />
        {"error" in categories ? (
          <Button disabled>No disponible</Button>
        ) : (
          <Suspense
            fallback={
              <Button disabled>
                <Loader2 />
              </Button>
            }
          >
            <EstimateFormDialog
              categories={categories.map((cat) => ({
                ...cat,
                services: cat.services.map((s) => ({
                  ...s,
                  category: cat.name,
                })),
              }))}
            />
          </Suspense>
        )}
      </aside>
      <Suspense fallback={<EstimatesContainerSkeleton />} key={filter}>
        <EstimatesContainer
          filter={filter}
          categories={categories as CategoryProps[]}
        />
      </Suspense>
    </section>
  )
}
