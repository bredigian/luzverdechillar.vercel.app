import EstimateItem, { EstimateItemSkeleton } from "./estimate-item"

import { CategoryProps } from "@/types/categories.types"
import { Service } from "@/services/estimates.service"

interface Props {
  filter?: string
  status?: string
  categories: CategoryProps[]
}

export default async function EstimatesContainer({
  filter,
  status,
  categories,
}: Props) {
  const estimates = await Service.getEstimates()
  if ("error" in estimates) return <p>{estimates?.error}</p>

  const filteredData = !filter
    ? estimates
    : estimates.filter(
        (item) =>
          item.person.firstName
            .concat(" ")
            .concat(item.person.lastName)
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          item.totalCost.toString().includes(filter) ||
          new Date(item.from).toLocaleDateString("es-AR").includes(filter) ||
          new Date(item.to).toLocaleDateString("es-AR").includes(filter)
      )

  const filteredByStatus = !status
    ? filteredData
    : filteredData.filter((item) => {
        if (status === "all") return true
        if (status === "active")
          return new Date(item.to).getTime() >= Date.now()
        if (status === "completed")
          return new Date(item.to).getTime() < Date.now()
        return false
      })

  return (
    <ul className="grid grid-cols-4 gap-4">
      {estimates.length === 0 ? (
        <li className="col-span-full font-thin">
          No se han registrado prespuestos todavia.
        </li>
      ) : filteredByStatus.length === 0 ? (
        <li className="col-span-full font-thin">
          No se encontraron resultados para <strong>{filter}</strong>
        </li>
      ) : (
        filteredByStatus.map((estimate) => (
          <EstimateItem
            key={estimate._id}
            data={estimate}
            categories={categories}
          />
        ))
      )}
    </ul>
  )
}

export const EstimatesContainerSkeleton = () => {
  return (
    <ul className="grid grid-cols-4 gap-4">
      {Array.from({ length: 10 }, (_, k) => (
        <EstimateItemSkeleton key={k} />
      ))}
    </ul>
  )
}
