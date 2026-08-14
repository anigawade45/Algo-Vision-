import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600/10 text-indigo-400 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300",
        secondary:
          "border-transparent bg-cyan-600/10 text-cyan-400 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300",
        outline: "text-slate-300 border-slate-700 dark:border-slate-700 dark:text-slate-300",
        success: "border-transparent bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "border-transparent bg-amber-500/10 text-amber-400 border-amber-500/20",
        glow: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
