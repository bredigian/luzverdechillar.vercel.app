import EstimatesContainer, {
  EstimatesContainerSkeleton,
} from "@/components/estimates-container"
import { RedirectType, redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CategoryProps } from "@/types/categories.types"
import EstimateFormDialog from "@/components/estimate-form"
import FilterSelector from "@/components/filter-selector"
import Finder from "@/components/finder"
import { Loader2 } from "lucide-react"
import { Service } from "@/services/categories.service"
import { Suspense } from "react"
import { cookies } from "next/headers"

interface Props {
  searchParams: Promise<{ filter: string; status: string }>
}

export default async function EstimatesPage({ searchParams }: Props) {
  const storedCookies = await cookies()
  if (!storedCookies) redirect("/", RedirectType.replace)

  const userdata = storedCookies.get("userdata")
  if (!userdata) redirect("/", RedirectType.push)

  const { access_token: accessToken } = JSON.parse(userdata.value)

  const categories = await Service.getCategories(accessToken)

  const { filter, status } = await searchParams

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="font-thin">
        Administrá y genera nuevos presupuestos para tus clientes
      </h1>
      <aside className="flex items-end justify-between gap-4">
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center items-end md:w-full md:justify-between">
              <FilterSelector defaultValue={status} className="md:w-36" />
              <EstimateFormDialog
                categories={categories.map((cat) => ({
                  ...cat,
                  services: cat.services.map((s) => ({
                    ...s,
                    category: cat.name,
                  })),
                }))}
              />
            </div>
          </Suspense>
        )}
      </aside>
      <Suspense fallback={<EstimatesContainerSkeleton />} key={filter}>
        <EstimatesContainer
          filter={filter}
          status={status}
          categories={categories as CategoryProps[]}
        />
      </Suspense>
    </section>
  )
}
