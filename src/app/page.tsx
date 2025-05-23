import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Image from "next/image"
import SigninForm from "@/components/signin-form"
import logo from "@/assets/logo.webp"

export default function Home() {
  return (
    <main className="h-dvh grid place-items-center gap-4 px-6">
      <Card className="w-11/12 sm:w-96">
        <CardHeader hidden></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="size-24 self-center rounded-full overflow-hidden bg-white p-3">
            <Image
              src={logo}
              alt="Logo de Luz Verde Chillar"
              className="size-full"
            />
          </div>
          <h1 className="self-center font-semibold">Luz Verde Chillar</h1>
          <SigninForm />
        </CardContent>
      </Card>
    </main>
  )
}
