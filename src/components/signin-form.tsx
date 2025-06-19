"use client"

import {
  Check,
  Eye,
  EyeClosed,
  KeyRoundIcon,
  Loader2,
  LogIn,
  User,
} from "lucide-react"

import { Button } from "./ui/button"
import Cookie from "js-cookie"
import CustomInput from "./custom-input"
import { ErrorResponseProps } from "@/types/responses.types"
import { Input } from "./ui/input"
import { Service } from "@/services/auth.service"
import { SigninFormProps } from "@/types/auth.types"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

type STATE = "pending" | "processing" | "success"

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormProps>()

  const [state, setState] = useState<STATE>("pending")

  const [passInput, setPassInput] = useState<"text" | "password">("password")

  const handlePassInput = () =>
    setPassInput((prev) => (prev === "password" ? "text" : "password"))

  const { push } = useRouter()

  const onSubmit = async (payload: SigninFormProps) => {
    try {
      setState("processing")
      const { username, firstName, lastName, access_token, exp } =
        await Service.signin(payload)
      setState("success")
      Cookie.set(
        "userdata",
        JSON.stringify({ access_token, username, firstName, lastName }),
        { expires: exp }
      )
      push("/dashboard/estimates")
    } catch (error) {
      setState("pending")
      const { message } = error as ErrorResponseProps
      toast.error(message, { position: "top-center" })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CustomInput
        id="username"
        error={errors?.username?.message}
        customInput={
          <div className="relative group flex items-center">
            <Input
              {...register("username", {
                required: "El usuario es requerido",
                minLength: {
                  value: 4,
                  message: "Debe contener al menos 4 caracteres",
                },
              })}
              id="username"
              className="peer text-sm pl-7 pb-1.5 peer"
              placeholder="Usuario"
            />
            <User className="absolute size-4 ml-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100" />
          </div>
        }
      />
      <CustomInput
        id="password"
        error={errors?.password?.message}
        customInput={
          <div className="relative group flex items-center">
            <Input
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 4,
                  message: "Debe contener al menos 4 caracteres",
                },
              })}
              id="password"
              className="peer text-sm pl-7 pb-1.5"
              type={passInput}
              placeholder="Contraseña"
            />
            <KeyRoundIcon className="absolute size-4 ml-2 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100" />
            <Button
              type="button"
              onClick={handlePassInput}
              size={"icon"}
              variant={"ghost"}
              className="absolute end-0 opacity-60 group-focus-within:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100"
            >
              {passInput === "password" ? <EyeClosed /> : <Eye />}
            </Button>
          </div>
        }
      />
      <Button
        type="submit"
        disabled={state === "processing" || state === "success"}
        data-success={state === "success" ? true : false}
        className="data-[success]:opacity-100 mt-2"
      >
        {state === "pending" ? (
          <>
            <LogIn />
            Ingresar
          </>
        ) : state === "processing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Check /> Bienvenido
          </>
        )}
      </Button>
    </form>
  )
}
