import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-orange-500 text-white hover:from-orange-500 hover:to-primary shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary to-blue-600 text-white hover:from-blue-600 hover:to-secondary shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-700 hover:bg-gray-100",
    accent: "bg-gradient-to-r from-accent to-yellow-400 text-gray-900 hover:from-yellow-400 hover:to-accent shadow-lg hover:shadow-xl"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-display font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button