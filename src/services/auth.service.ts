import { SessionProps, SigninFormProps } from "@/types/auth.types"

import { ErrorResponseProps } from "@/types/responses.types"

export const Service = {
  signin: async (payload: SigninFormProps) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/auth"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data: SessionProps | ErrorResponseProps = await res.json()

    if (!res.ok) throw data as ErrorResponseProps

    return data as SessionProps
  },

  verifySession: async (access_token: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const PATH = "/v1/auth/session"
    const URL = `${API_URL}${PATH}`

    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({ access_token }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data: SessionProps | ErrorResponseProps = await res.json()

    if (!res.ok) return data as ErrorResponseProps

    return data as SessionProps
  },
}
