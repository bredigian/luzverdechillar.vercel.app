import { ServiceProps } from "@/types/services.types"
import { useState } from "react"

export const useServicesController = (isOptional?: boolean) => {
  const storedServices = localStorage.getItem("services_temp")

  const [selectedServices, setSelectedServices] = useState<ServiceProps[]>(
    isOptional
      ? []
      : !storedServices
      ? [
          {
            _id: "",
            description: "",
            cost: 0,
            quantity: 1,
            type: "",
          } as ServiceProps,
        ]
      : JSON.parse(storedServices)
  )

  const addService = () =>
    setSelectedServices((prev) => [
      ...prev,
      {
        _id: "",
        description: "",
        cost: 0,
        quantity: 1,
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
          type: service.type,
        }
      } else {
        return item
      }
    })
    setSelectedServices(updatedServices)
  }

  const handleUpdateSelectedServicesOnLocalStorage = () =>
    localStorage.setItem("services_temp", JSON.stringify(selectedServices))

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
              quantity: 1,
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
    clearAll,
  }
}
