import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ThumbsUp, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { IReportUI } from "@/types/report"

interface ReportCardProps extends Omit<IReportUI, 'createdAt'> {
  authorImage?: string
}

const statusConfig = {
  Menunggu: "bg-red-100 text-red-800 hover:bg-red-200 border-none",
  Diproses: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none",
  Selesai: "bg-green-100 text-green-800 hover:bg-green-200 border-none",
}

export function ReportCard({
  id,
  title,
  category,
  status,
  time,
  author,
  votes,
  imageUrl,
  authorImage,
}: ReportCardProps) {
  return (
    <Link to={`/report-detail/${id}`} className="block h-full group">
      <Card className="h-full overflow-hidden border-border bg-card shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 rounded-3xl cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <Badge className={cn("px-3 py-1 font-bold shadow-sm backdrop-blur-[2px]", statusConfig[status as keyof typeof statusConfig])}>
            {status}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-4 p-5">
        {/* Meta Header */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-blue-700/10 text-blue-700 dark:bg-blue-600/10 dark:text-blue-600 rounded-lg px-2 py-0.5 font-medium flex gap-1.5 items-center">
             <div className="w-1 h-1 rounded-full bg-blue-700 dark:bg-blue-600" />
             {category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-foreground transition-colors">
          {title}
        </h3>

        {/* Divider */}
        <div className="h-[1px] w-full bg-border" />
      </CardContent>

      <CardFooter className="flex items-center justify-between p-5 pt-0">
        {/* Votes */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className={cn("w-4 h-4", votes > 30 ? "text-blue-700 dark:text-blue-600 fill-blue-700/10 dark:fill-blue-600/10" : "text-muted-foreground")} />
            <span className={cn("text-sm font-bold", votes > 30 ? "text-blue-700 dark:text-blue-600" : "text-muted-foreground")}>
                {votes}
            </span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted overflow-hidden border border-border shadow-sm">
            {authorImage ? (
              <img src={authorImage} alt={author} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-muted-foreground bg-muted">
                {author.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-muted-foreground">{author}</span>
        </div>
      </CardFooter>
      </Card>
    </Link>
  )
}
