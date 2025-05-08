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
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  open?: boolean
  onOpenChange?: (open: boolean) => void
  customTrigger?: ReactNode
}

export default function DialogAdaptative({
  children,
  title,
  description,
  triggerButtonText,
  icon,
  variant,
  open,
  onOpenChange,
  customTrigger,
}: Props) {
  const isMobile = useIsMobile()

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange} closeThreshold={1}>
      <DrawerTrigger asChild>
        {!customTrigger ? (
          <Button variant={variant}>
            {icon && icon}
            {triggerButtonText}
          </Button>
        ) : (
          customTrigger
        )}
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {!customTrigger ? (
          <Button variant={variant}>
            {icon && icon}
            {triggerButtonText}
          </Button>
        ) : (
          customTrigger
        )}
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
