import { cn } from "@/utils/cn"

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("w-full space-y-6 p-6", className)} {...props}>
      <div className="space-y-4">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" style={{ width: `${80 - i * 10}%` }} />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  )
}

export default Loading