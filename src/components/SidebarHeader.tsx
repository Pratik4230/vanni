import { LucideIcon } from "lucide-react"

function SidebarHeader({
  title,
  icon: Icon,
}: {
  title: string
  icon: LucideIcon
}) {
  return (
    <div className="flex-none border-b px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
    </div>
  )
}

export default SidebarHeader
