import * as React from "react"
import { cn } from "@/utils/cn"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4",
      {
        "bg-background text-foreground": variant === "default",
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive":
          variant === "destructive",
        "border-yellow-500/50 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600":
          variant === "warning",
        "border-blue-500/50 bg-blue-50 text-blue-900 [&>svg]:text-blue-600":
          variant === "info",
        "border-green-500/50 bg-green-50 text-green-900 [&>svg]:text-green-600":
          variant === "success",
      },
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }