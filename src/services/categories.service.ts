import { CategoryProps } from "@/types/categories.types"
import { ErrorResponseProps } from "@/types/responses.types"

export const Service = {
  getCategories: async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/categories"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "GET",
      next: { tags: ["categories"] },
    })

    const data: CategoryProps[] | ErrorResponseProps = await res.json()

    if (!res.ok) return data as ErrorResponseProps

    return data as CategoryProps[]
  },
}
