import { ServiceProps } from "./services.types"

interface PersonProps {
  firstName: string
  lastName: string
}

export interface EstimateProps {
  _id?: string
  person: PersonProps
  from: Date
  to: Date
  services: ServiceProps[]
  totalCost: number
  createdAt?: Date
  updatedAt?: Date
}
