import { ErrorResponseProps } from "@/types/responses.types"
import { EstimateProps } from "@/types/estimates.types"

export const Service = {
  generateEstimate: async (payload: EstimateProps) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/estimates"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data: EstimateProps | ErrorResponseProps = await res.json()

    if (!res.ok) throw data as ErrorResponseProps

    return data as EstimateProps
  },
  getEstimates: async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/estimates"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "GET",
      next: { tags: ["estimates"] },
    })

    const data: EstimateProps[] | ErrorResponseProps = await res.json()

    if (!res.ok) return data as ErrorResponseProps

    return data as EstimateProps[]
  },
}
