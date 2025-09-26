import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ className, message = "Something went wrong", onRetry, ...props }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8 text-center", className)} {...props}>
      <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error