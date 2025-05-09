export interface ServiceProps {
  _id?: string
  category: string
  type: string
  description: string
  cost: number | null
  originalCost: number | null
  quantity?: number
}
