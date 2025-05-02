import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"

import { ReactNode } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface Props {
  children: ReactNode
  title: string
  description?: string
}

export default function DialogAdaptative({
  children,
  title,
  description,
}: Props) {
  const isMobile = useIsMobile()

  return isMobile ? (
    <Drawer>
      <DrawerContent>
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
