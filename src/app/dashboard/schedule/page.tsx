import Schedule from "@/components/schedule"
import Screen from "@/components/layout/screen"
import { Service } from "@/services/estimates.service"

export default async function SchedulesPage() {
  const estimates = await Service.getEstimates()
  if ("error" in estimates) return <p>{estimates.error}</p>

  return (
    <Screen className="flex-col gap-4">
      <Schedule data={estimates} />
    </Screen>
  )
}
