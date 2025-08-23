import { RedirectType } from "next/navigation"
import Schedule from "@/components/schedule"
import { Service } from "@/services/estimates.service"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function SchedulesPage() {
  const storedCookies = await cookies()
  if (!storedCookies) redirect("/", RedirectType.replace)

  const userdata = storedCookies.get("userdata")
  if (!userdata) redirect("/", RedirectType.push)

  const { access_token: accessToken } = JSON.parse(userdata.value)

  const estimates = await Service.getEstimates(accessToken)
  if ("error" in estimates) return <p>{estimates.error}</p>

  return (
    <section className="flex flex-col gap-4 w-full">
      <Schedule data={estimates} />
    </section>
  )
}
