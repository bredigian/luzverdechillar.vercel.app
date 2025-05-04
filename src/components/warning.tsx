import { cn } from "@/lib/utils"

interface Props {
  message: string
  className?: string
}

export default function Warning({ message, className }: Props) {
  return (
    <p
      className={cn(
        "px-2 py-0.5 rounded-3xl bg-amber-300 text-black text-xs",
        className
      )}
    >
      {message}
    </p>
  )
}
