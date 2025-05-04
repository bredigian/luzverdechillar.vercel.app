import EstimateItem, { EstimateItemSkeleton } from "./estimate-item"

import { Service } from "@/services/estimates.service"

interface Props {
  filter?: string
}

export default async function EstimatesContainer({ filter }: Props) {
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

  return (
    <ul className="grid grid-cols-4 gap-4">
      {filteredData.map((estimate) => (
        <EstimateItem key={estimate._id} data={estimate} />
      ))}
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
