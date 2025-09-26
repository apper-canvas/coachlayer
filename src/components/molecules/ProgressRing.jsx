import { cn } from "@/utils/cn"

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  className,
  label,
  value,
  color = "primary",
  ...props 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colors = {
    primary: "#FF6B35",
    secondary: "#004E89",
    accent: "#FFD23F",
    success: "#28A745"
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)} {...props}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-display font-bold text-gray-900">{value}</div>
        {label && <div className="text-xs font-body text-gray-600 text-center">{label}</div>}
      </div>
    </div>
  )
}

export default ProgressRing