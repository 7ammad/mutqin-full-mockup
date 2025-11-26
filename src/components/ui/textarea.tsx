import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[var(--border)] placeholder:text-[var(--tertiary-label)] focus-visible:border-[var(--ring)] focus-visible:ring-[var(--ring)]/50 aria-invalid:ring-[var(--apple-red)]/20 aria-invalid:border-[var(--apple-red)] flex field-sizing-content min-h-16 w-full rounded-ios-sm border bg-[var(--system-background)] backdrop-blur-sm px-3 py-2 text-base text-[var(--label)] shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
