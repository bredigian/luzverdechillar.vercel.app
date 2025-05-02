import { ServiceProps } from "./services.types"

export interface CategoryProps {
  _id?: string
  name: string
  services: ServiceProps[]
}
