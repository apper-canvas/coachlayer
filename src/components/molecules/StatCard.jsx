import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  gradient = "from-primary/10 to-orange-100",
  className,
  ...props 
}) => {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-gray-600"
  }

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-body font-medium text-gray-600">{title}</h3>
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/50 to-white/30 flex items-center justify-center">
                <ApperIcon name={icon} className="w-4 h-4 text-gray-700" />
              </div>
            )}
          </div>
          <p className="text-3xl font-display font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={cn("text-sm font-body flex items-center gap-1", changeColors[changeType])}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                size={14} 
              />
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard