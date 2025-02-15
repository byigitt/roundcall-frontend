"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "fullscreen" | "inline" | "skeleton"
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "inline", size = "md", className, ...props }, ref) => {
    if (variant === "fullscreen") {
      return (
        <div
          ref={ref}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          {...props}
        >
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            {props.children && (
              <p className="text-sm text-muted-foreground">{props.children}</p>
            )}
          </div>
        </div>
      )
    }

    if (variant === "skeleton") {
      return (
        <div
          ref={ref}
          className={cn("animate-pulse rounded-md bg-muted", className)}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      </div>
    )
  }
)
Loading.displayName = "Loading"

export { Loading } 