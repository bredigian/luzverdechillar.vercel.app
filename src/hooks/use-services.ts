import { ServiceProps } from "@/types/services.types"
import { useState } from "react"

export const useServicesController = (
  variableNameForLS: string,
  isOptional?: boolean
) => {
  const storedServices = localStorage.getItem(variableNameForLS)

  const [selectedServices, setSelectedServices] = useState<ServiceProps[]>(
    storedServices
      ? JSON.parse(storedServices)
      : isOptional
      ? []
      : [
          {
            _id: "",
            description: "",
            cost: 0,
            originalCost: 0,
            quantity: 1,
            category: "",
            type: "",
          } as ServiceProps,
        ]
  )

  const addService = () =>
    setSelectedServices((prev) => [
      ...prev,
      {
        _id: "",
        description: "",
        cost: 0,
        originalCost: 0,
        quantity: 1,
        category: "",
        type: "",
      } as ServiceProps,
    ])

  const deleteService = (index: number) =>
    setSelectedServices((prev) => prev.filter((_, i) => i !== index))

  const handleChangeSelectValue = (service: ServiceProps, index: number) => {
    const updatedServices = selectedServices.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          _id: service._id,
          description: service.description,
          cost: service.cost,
          originalCost: service.originalCost,
          category: service.category,
          type: service.type,
        }
      } else {
        return item
      }
    })
    setSelectedServices(updatedServices)
  }

  const handleUpdateSelectedServicesOnLocalStorage = (
    variableName: "services_temp" | "extra_services_temp"
  ) => {
    localStorage.setItem(variableName, JSON.stringify(selectedServices))
  }

  const handleChangeServiceCost = (value: number, id: string) => {
    setSelectedServices((prev) =>
      prev.map((item) => {
        return {
          ...item,
          cost: item._id === id ? value : item.cost,
        }
      })
    )
  }

  const handleChangeServiceQuantity = (value: number, id: string) => {
    setSelectedServices((prev) =>
      prev.map((item) => {
        return {
          ...item,
          quantity: item._id === id ? value : item.quantity,
        }
      })
    )
  }

  const handleApplyDiscount = (discount: number) =>
    setSelectedServices((prev) =>
      prev.map((i) => ({
        ...i,
        cost:
          discount < 1 || discount > 100
            ? i.originalCost
            : ((100 - discount) * i.originalCost!) / 100,
      }))
    )

  const areEmptySelectedServices = selectedServices.some((service) =>
    !service._id || !service.cost ? true : false
  )

  const clearAll = () =>
    setSelectedServices(
      isOptional
        ? []
        : [
            {
              _id: "",
              description: "",
              cost: 0,
              originalCost: 0,
              quantity: 1,
              category: "",
              type: "",
            } as ServiceProps,
          ]
    )

  return {
    selectedServices,
    handleChangeServiceCost,
    areEmptySelectedServices,
    addService,
    deleteService,
    handleUpdateSelectedServicesOnLocalStorage,
    handleChangeSelectValue,
    handleChangeServiceQuantity,
    handleApplyDiscount,
    clearAll,
  }
}
