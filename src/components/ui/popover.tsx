"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <PopoverPrimitive.Trigger
        data-slot="popover-trigger"
        render={children as React.ReactElement<Record<string, unknown>>}
        {...props}
        />
      )
  }
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props}>
      {children}
    </PopoverPrimitive.Trigger>
    )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      sideOffset={sideOffset}
      className="z-50"
      >
    <PopoverPrimitive.Popup
      data-slot="popover-content"
      className={cn(
        "w-72 origin-[var(--transform-origin)] rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className
        )}
      {...props}
      />
    </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
    )
}

export { Popover, PopoverTrigger, PopoverContent }
