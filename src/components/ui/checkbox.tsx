import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onCheckedChange?.(e.target.checked);
            props.onChange?.(e);
        };

        return (
            <input
                type="checkbox"
                ref={ref}
                checked={checked}
                onChange={handleChange}
                className={cn(
                    "h-4 w-4 rounded-ios-sm border border-[var(--border)] bg-[var(--system-background)] text-[var(--apple-blue)] focus:ring-2 focus:ring-[var(--apple-blue)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className
                )}
                {...props}
            />
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

