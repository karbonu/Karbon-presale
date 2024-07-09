"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-[4px] w-full overflow-hidden rounded-full bg-[#FFFFFF4D]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
    > 
    <div className="h-[4px] w-full flex-1 bg-[#08E04A] transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}>
        <div className="w-[100%] animate-progress-pulse bg-[#868585]" >
          a
        </div>
    </div>
    
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
