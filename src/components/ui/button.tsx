import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { GlassButton } from "./glass-button"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[var(--apple-blue)] text-white hover:opacity-90",
                destructive: "bg-[var(--apple-red)] text-white hover:opacity-90",
                outline: "border border-[var(--border)] bg-transparent hover:bg-[var(--system-fill)]",
                secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80",
                ghost: "hover:bg-[var(--system-fill)]",
                link: "text-[var(--apple-blue)] underline-offset-4 hover:underline",
                emerald: "bg-[var(--apple-green)] text-white hover:opacity-90",
                blue: "bg-[var(--apple-blue)] text-white hover:opacity-90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    glass?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, glass = true, children, ...props }, ref) => {
        if (glass && !asChild) {
            // Map button variants to glass button variants
            const glassVariant = 
                variant === "default" || variant === "blue" ? "primary" :
                variant === "destructive" || variant === "emerald" ? "primary" :
                variant === "secondary" ? "secondary" :
                variant === "ghost" ? "ghost" :
                "default";
            
            return (
                <GlassButton
                    ref={ref}
                    variant={glassVariant}
                    size={size}
                    className={cn(className)}
                    {...props}
                >
                    {children}
                </GlassButton>
            );
        }
        
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            >
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
