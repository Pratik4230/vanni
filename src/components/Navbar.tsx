import Link from "next/link"
import { LucideLanguages, Settings2, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LeftSidebar from "./LeftSidebar"
import RightSidebar from "./RightSidebar"

export function Navbar() {
  return (
    <header className="border-fire relative z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="relative flex h-14 items-center px-3 sm:h-16 sm:px-6">
        <div className="flex items-center">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="sr-only">Open configuration</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Configuration</SheetTitle>
                  <SheetDescription>
                    Set your app configuration
                  </SheetDescription>
                </SheetHeader>
                <LeftSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 0 12px rgb(249 115 22 / 35%)",
            }}
          >
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "#ea580c" }}
          >
            Vanni
          </span>
        </Link>

        <div className="ml-auto flex items-center">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                >
                  <LucideLanguages className="h-5 w-5" />
                  <span className="sr-only">Open transcript</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Transcript</SheetTitle>
                  <SheetDescription>
                    Voice conversation transcript
                  </SheetDescription>
                </SheetHeader>
                <RightSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
