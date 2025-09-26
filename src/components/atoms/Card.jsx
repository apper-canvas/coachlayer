import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-gray-100 bg-surface shadow-lg shadow-gray-100/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
    {...props}
  />
))

CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
))

CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-body text-gray-600", className)}
    {...props}
  />
))

CardDescription.displayName = "CardDescription"

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))

CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }