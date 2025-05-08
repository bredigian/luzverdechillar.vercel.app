import Schedule from "@/components/schedule"
import { Service } from "@/services/estimates.service"

export default async function SchedulesPage() {
  const estimates = await Service.getEstimates()
  if ("error" in estimates) return <p>{estimates.error}</p>

  return (
    <section className="flex flex-col gap-4 w-full">
      <Schedule data={estimates} />
    </section>
  )
}
