"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export interface SelectContentProps {
    children: React.ReactNode;
    glass?: boolean;
    className?: string;
}

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}>({
    open: false,
    setOpen: () => {},
});

const Select = ({ value, onValueChange, children }: SelectProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className, children, ...props }, ref) => {
        const { open, setOpen } = React.useContext(SelectContext);

        return (
            <button ref={ref}
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-ios-sm border border-[var(--border)] bg-[var(--system-background)] backdrop-blur-sm px-3 py-2 text-sm text-[var(--label)] ring-offset-[var(--system-background)] placeholder:text-[var(--tertiary-label)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
    const { value } = React.useContext(SelectContext);
    return <span>{value ? children : placeholder}</span>;
};

const SelectContent = ({ children, glass, className }: SelectContentProps) => {
    const { open, setOpen } = React.useContext(SelectContext);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen]);

    if (!open) return null;

    return (
        <div
            ref={contentRef}
            className={cn(
                "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-ios-sm border border-[var(--border)] bg-[var(--system-background)] backdrop-blur-xl shadow-lg",
                glass && "bg-[var(--system-background)]/80",
                className
            )}
        >
            {children}
        </div>
    );
};

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
    ({ className, value, children, ...props }, ref) => {
        const { onValueChange, setOpen } = React.useContext(SelectContext);

        const handleClick = () => {
            onValueChange?.(value);
            setOpen(false);
        };

        return (
            <button
                ref={ref}
                type="button"
                onClick={handleClick}
                className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-ios-sm px-3 py-2 text-sm text-[var(--label)] outline-none hover:bg-[var(--system-fill)] focus:bg-[var(--system-fill)] transition-colors",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

