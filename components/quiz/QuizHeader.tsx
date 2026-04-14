import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  title: string
  description?: string
  progress?: { current: number; total: number }
  onClose: () => void
}

export function QuizHeader({ title, description, progress, onClose }: Props) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {progress && (
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{progress.current}</span>
              {" / "}
              {progress.total}
            </span>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}
