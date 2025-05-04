import EstimateItem from "./estimate-item"
import { Service } from "@/services/estimates.service"

export default async function EstimatesContainer() {
  const estimates = await Service.getEstimates()
  if ("error" in estimates) return <p>{estimates?.error}</p>

  return (
    <ul className="grid grid-cols-4 gap-4">
      {estimates.map((estimate) => (
        <EstimateItem key={estimate._id} data={estimate} />
      ))}
    </ul>
  )
}
