import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

import { Button } from "./ui/button"
import { ReactNode } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface Props {
  children: ReactNode
  title: string
  description?: string
  triggerButtonText: string
  icon?: ReactNode
}

export default function DialogAdaptative({
  children,
  title,
  description,
  triggerButtonText,
  icon,
}: Props) {
  const isMobile = useIsMobile()

  return isMobile ? (
    <Drawer closeThreshold={1}>
      <DrawerTrigger asChild>
        <Button>
          {icon && icon}
          {triggerButtonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="!h-auto">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription hidden={!description ? true : false}>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {icon && icon}
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription hidden={!description ? true : false}>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
