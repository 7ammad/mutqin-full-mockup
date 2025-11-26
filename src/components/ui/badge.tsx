import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-[var(--border)] bg-[var(--system-fill)] text-[var(--label)] hover:opacity-80",
                secondary:
                    "border-[var(--border)] bg-[var(--secondary-system-fill)] text-[var(--label)] hover:opacity-80",
                destructive:
                    "border-transparent bg-[var(--apple-red)]/20 text-[var(--apple-red)] hover:opacity-80",
                outline: "border-[var(--border)] text-[var(--label)] bg-transparent",
                emerald: "border-transparent bg-[var(--apple-green)]/20 text-[var(--apple-green)]",
                blue: "border-transparent bg-[var(--apple-blue)]/20 text-[var(--apple-blue)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
