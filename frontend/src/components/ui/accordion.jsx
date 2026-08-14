import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-[#263247] py-2", className)}
    {...props}
  >
    {children}
  </div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, isOpen, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn(
      "flex w-full items-center justify-between py-4 text-left text-base font-medium text-slate-100 transition-all hover:text-indigo-400 focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
        isOpen && "rotate-180 text-indigo-400"
      )}
    />
  </button>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef(({ className, children, isOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-slate-400 transition-all duration-300",
      isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
AccordionContent.displayName = "AccordionContent"

export { AccordionItem, AccordionTrigger, AccordionContent }
