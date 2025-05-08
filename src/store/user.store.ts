import Cookie from "js-cookie"
import { UserProps } from "@/types/auth.types"
import { create } from "zustand"

interface StoreProps {
  userdata: {
    username: string
    firstName: string
    lastName: string
  } | null

  setUserdata: ({ username, firstName, lastName }: Partial<UserProps>) => void
  clearUserdata: () => void
}

export const useUserStore = create<StoreProps>((set) => ({
  userdata: null,

  setUserdata: ({ username, firstName, lastName }) =>
    set({
      userdata: { username, firstName, lastName } as {
        username: string
        firstName: string
        lastName: string
      },
    }),

  clearUserdata: () => {
    Cookie.remove("userdata")
    set({ userdata: null })
  },
}))
