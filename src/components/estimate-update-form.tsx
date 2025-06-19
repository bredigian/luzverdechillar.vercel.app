"use client"

import { CategoryProps } from "@/types/categories.types"
import DialogAdaptative from "./adaptative-dialog"
import { Edit } from "lucide-react"
import { EstimateForm } from "./estimate-form"
import { EstimateProps } from "@/types/estimates.types"
import { useDialog } from "@/hooks/use-dialog"

interface Props {
  data: EstimateProps
  categories: CategoryProps[]
  handleDialog?: () => void
}

export default function EstimateUpdateFormDialog({ data, categories }: Props) {
  const personFullname = `${data.person.firstName} ${data.person.lastName}`
  const { open, setOpen } = useDialog()

  return (
    <DialogAdaptative
      open={open}
      onOpenChange={setOpen}
      title="Modificar"
      description={`Actualizá el prespuesto de ${personFullname}`}
      triggerButtonText="Modificar"
      icon={<Edit />}
    >
      <EstimateForm categories={categories} defaultData={data} />
    </DialogAdaptative>
  )
}
