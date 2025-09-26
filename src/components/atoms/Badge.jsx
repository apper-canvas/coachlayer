import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary/20 to-orange-200 text-primary",
    secondary: "bg-gradient-to-r from-secondary/20 to-blue-200 text-secondary",
    accent: "bg-gradient-to-r from-accent/20 to-yellow-200 text-amber-800",
    success: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800",
    destructive: "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-medium transition-all duration-200 hover:scale-105",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge