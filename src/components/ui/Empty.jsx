import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className, 
  title = "No data found", 
  description = "Get started by adding some content.",
  action,
  actionLabel = "Get Started",
  icon = "Package",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8 text-center", className)} {...props}>
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action} size="lg" className="gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty