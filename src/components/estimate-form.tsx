"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"

import CustomInput from "./custom-input"
import DialogAdaptative from "./adaptative-dialog"
import { EstimateProps } from "@/types/estimates.types"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { useIsMobile } from "@/hooks/use-mobile"

function EstimateForm() {
  const { register, handleSubmit } = useForm<EstimateProps>()

  return (
    <Card>
      <CardHeader hidden></CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <CustomInput label="Nombre" customInput={<Input />} />
        </form>
      </CardContent>
    </Card>
  )
}

export default function EstimateFormDialog() {
  return (
    <DialogAdaptative
      title="Nuevo prespuesto"
      description="Completá el siguiente formulario y generá tu presupuesto."
    >
      <EstimateForm />
    </DialogAdaptative>
  )
}
