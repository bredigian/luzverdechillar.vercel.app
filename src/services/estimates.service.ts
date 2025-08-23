import { ErrorResponseProps } from "@/types/responses.types"
import { EstimateProps } from "@/types/estimates.types"

export const Service = {
  generateEstimate: async (payload: EstimateProps, accessToken: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/estimates"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const data: EstimateProps | ErrorResponseProps = await res.json()

    if (!res.ok) throw data as ErrorResponseProps

    return data as EstimateProps
  },
  getEstimates: async (accessToken: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/estimates"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { tags: ["estimates"] },
    })

    const data: EstimateProps[] | ErrorResponseProps = await res.json()

    if (!res.ok) return data as ErrorResponseProps

    return data as EstimateProps[]
  },
  updateEstimate: async (
    _id: string,
    payload: EstimateProps,
    accessToken: string
  ) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = `/v1/estimates?_id=${_id}`
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const data: EstimateProps | ErrorResponseProps = await res.json()

    if (!res.ok) throw data as ErrorResponseProps

    return data as EstimateProps
  },
  deleteEstimate: async (_id: EstimateProps["_id"], accessToken: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = `/v1/estimates?_id=${_id}`
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data: EstimateProps | ErrorResponseProps = await res.json()

    if (!res.ok) throw data as ErrorResponseProps

    return data as EstimateProps
  },
}
