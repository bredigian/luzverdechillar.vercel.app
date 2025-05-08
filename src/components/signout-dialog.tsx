import { Loader2, LogOut } from "lucide-react"

import { Button } from "./ui/button"
import DialogAdaptative from "./adaptative-dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserStore } from "@/store/user.store"

type STATE = "pending" | "processing" | "success"

export default function SignoutDialog() {
  const { clearUserdata } = useUserStore()
  const [state, setState] = useState<STATE>("pending")
  const { refresh } = useRouter()

  const handleSignout = () => {
    setState("processing")

    setTimeout(() => {
      clearUserdata()
      setState("success")
      refresh()
    }, 500)
  }

  return (
    <DialogAdaptative
      title="¿Estás seguro?"
      description="Se cerrará la sesión"
      triggerButtonText="Salir"
      customTrigger={
        <button className="cursor-pointer w-full hover:bg-accent focus:text-accent-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <LogOut />
          Cerrar sesión
        </button>
      }
    >
      <Button
        onClick={handleSignout}
        variant={"destructive"}
        className="mx-4 mb-4 md:m-0 md:ml-auto"
        disabled={state !== "pending"}
      >
        {state === "pending" ? (
          <>Salir</>
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </DialogAdaptative>
  )
}
