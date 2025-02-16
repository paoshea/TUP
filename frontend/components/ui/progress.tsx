"use client"

import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  max?: number
  className?: string
  indicatorClassName?: string
}

export function Progress({
  value = 0,
  max = 100,
  className,
  indicatorClassName
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all duration-200",
          indicatorClassName
        )}
        style={{
          transform: `translateX(-${100 - percentage}%)`
        }}
      />
    </div>
  )
}