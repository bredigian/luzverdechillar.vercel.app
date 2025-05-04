import { Dispatch, SetStateAction, useState } from "react"

export interface Dialog {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleOpen: () => void
}

export const useDialog = (defaultValue?: boolean) => {
  const [open, setOpen] = useState(defaultValue ?? false)
  const handleOpen = () => setOpen(!open)

  return { open, setOpen, handleOpen }
}
