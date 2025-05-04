"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

import { ArrowRight } from "lucide-react"
import { Badge } from "./ui/badge"
import { EstimateProps } from "@/types/estimates.types"
import Image from "next/image"
import { Service } from "@/services/pdf.services"
import { Skeleton } from "./ui/skeleton"
import { format } from "date-fns"
import logo from "@/assets/logo.webp"

interface Props {
  data: EstimateProps
}

export default function EstimateItem({ data }: Props) {
  const personFullname = `${data.person.firstName} ${data.person.lastName}`
  const dateFromString = format(data.from, "dd/MM/yyyy").toString()
  const dateToString = format(data.to, "dd/MM/yyyy").toString()
  const totalCostString = Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(data.totalCost)

  const createdAtString = format(
    data.createdAt as Date,
    "dd/MM/yyyy"
  ).toString()

  return (
    <li className="col-span-full">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => Service.generatePDF(data)}
      >
        <Card className="bg-card/50 hover:bg-card/100 duration-200 ease-in-out cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <span>{personFullname}</span>
              <Badge variant={"default"}>{totalCostString}</Badge>
            </CardTitle>
            <CardDescription hidden></CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant={"secondary"}>
              <span>{dateFromString}</span>
              <ArrowRight className="size-4" />
              <span>{dateToString}</span>
            </Badge>
            <Badge variant={"outline"} className="font-extralight opacity-50">
              Creado el {createdAtString}
            </Badge>
          </CardContent>
          <CardFooter hidden>
            <Image
              id="luz_verde_chillar_logo"
              hidden
              alt="Logo auxiliar de Luz Verde Chillar"
              src={logo}
            />
          </CardFooter>
        </Card>
      </button>
    </li>
  )
}

export const EstimateItemSkeleton = () => {
  return (
    <li className="col-span-full">
      <Card className="bg-card/50 hover:bg-card/100 duration-200 ease-in-out">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-5" />
          </CardTitle>
          <CardDescription hidden></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="w-54 h-5" />
          <Skeleton className="w-48 h-5" />
        </CardContent>
        <CardFooter hidden></CardFooter>
      </Card>
    </li>
  )
}
